var express = require('express');
var _ = require('lodash');
var Promise = require('bluebird');


const LICENSES = {
  "4": {
    "flickrId": 4,
    "name": "Attribution License",
    "shortName": "CC-BY",
    "url": "https://creativecommons.org/licenses/by/2.0/"
  },
  "5": {
    "flickrId": 5,
    "name": "Attribution-ShareAlike License",
    "shortName": "CC-BY-SA",
    "url": "https://creativecommons.org/licenses/by-sa/2.0/"
  },
  "6": {
    "flickrId": 6,
    "name":"Attribution-NoDerivs License",
    "shortName": "CC-BY-ND",
    "url":"https://creativecommons.org/licenses/by-nd/2.0/"
  },
  "9": {
    "flickrId": 9,
    "name":"Public Domain Dedication (CC0)",
    "shortName": "CC0",
    "url":"https://creativecommons.org/publicdomain/zero/1.0/"
  }
};

module.exports = (config, logger, dependencies) => {
  let productionErrorHandler = (err, req, res, next) => {
    err.status  = err.status || err.statusCode || 500;
    err.message = err.message   || 'Internal Server Error';

    res.status(err.status).send(err.message);
    return next(err);
  };

  let errorLogger = (err, req, res, next) => {
    logger.error({err, req, res}, (err.message || 'Internal Server Error'));
    return next(err);
  };


  let app = express();
  app.log = logger;
  app.locals = dependencies;

  app.get('/', (req, res, next) => {
    res.send('Hello, world!');
  });

  app.get('/api/search', (req, res, next) => {
    let db = app.locals.db;
    function getPhotoFromDb(flickrId) {
      return db.table("photo").getAll(flickrId, {index: "flickrId"}).nth(0).default(null).run();
    }

    function storePhoto(photo) {
      // TODO: NON ATOMIC! Same photo may be inserted twice in rare cases
      // "Hack now, fix later" they said...
      return db.table("photo").insert(photo, {returnChanges: true}).run()
        .then(result => {
          return result.changes[0].new_val;
        })
    }

    function getPhotoFromFlickr(flickrId) {
      return Promise.props({
        info: app.locals.flickrClient.getPhotoInfo(flickrId),
        images: app.locals.flickrClient.getPhotoImage(flickrId)
      })
      .then(result => {
        let photo = result.info;
        photo.image = result.images.large;
        photo.thumbnail = result.images.thumbnail;
        photo.viewCount = 0;
        return photo;
      })
    }

    function getPhoto(flickrId) {
      return getPhotoFromDb(flickrId)
        .then(photo => {
          if (photo) { // photo already imported
            return photo;
          } else {
            // photo not imported, fetch from flickr and store
            return getPhotoFromFlickr(flickrId)
              .then(storePhoto)
          }
        })
    }

    let query = req.query.q;

    app.locals.flickrClient.search(query)
      .then(ids => {
        return Promise.map(ids, getPhoto)
      })
      .then(results => {
        return _.map(results, r => {
          r.license = LICENSES[r.license];
          return r;
        })
      })
      .then(results => {
        res.json(results);
      })
      .catch(next);
  });

  app.get("/api/photo/:photoId", (req, res, next) => {
    var photoId = req.params.photoId;

    app.locals.db.table("photo").get(photoId).run()
      .then(photo => {
        res.json(photo)
      })
      .catch(next);
  });

  app.get('/w/1/i/:id/:width,:height', (req, res, next) => {
    let db = app.locals.db;
    let cloudinary = app.locals.cloudinary;
    let logger = app.logger;

    let photoId = req.params.id;
    let width = req.params.width;
    let height = req.params.height;

    // Increase view count
    db.table("photo").get(photoId).update({viewCount: db.row("viewCount").add(1).default(0)}).run()
      .catch(err => {
        // INTENTIONAL! We do not wait for db response
        // It is OK if some views are not counted
        logger.error({err}, 'Error while increasing view count');
      });

    db.table("photo").get(photoId).getField("image").default(null).run()
      .then(image => {
        if (image == null) {
          let err = new Error('Not Found');
          err.status = 404;
          return Promise.reject(err);
        }

        if (image.cloudinaryId) { // already uploaded to cloudinary
          return image.cloudinaryId;
        } else { // upload to cloudinary
          return cloudinary.upload(image.url)
            .then(response => {
              let cloudinaryId = response.public_id;
              // Store in db, async
              db.table("photo").get(photoId).update({image: {cloudinaryId: cloudinaryId}}).run()
                .catch(err => {
                  // INTENTIONAL! We do not wait for image to be store in db and ignore errors
                  // It is OK, the image will be reuploaded next time
                  logger.error({err}, 'Error while uploading image to cloudinary');
                });
              return cloudinaryId;
            });
        }
      })
      .then(cloudinaryId => {
        return cloudinary.getUrl(cloudinaryId, width, height);
      })
      .then(url => {
        res.redirect(url);
      })
      .catch(next);
  });

  app.use(errorLogger);
  if (config.env == 'development') {
    app.use(require('errorhandler')());
  } else {
    app.use(productionErrorHandler);
  }

  return app;
};
