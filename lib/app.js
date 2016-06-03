var express = require('express');
var _ = require('lodash');
var Promise = require('bluebird');

var Flickr = require('./Flickr');

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

module.exports = (config, logger, db) => {
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
  app.db = db;
  app.flickrClient = new Flickr(config.flickr.apiKey, logger);

  app.get('/', (req, res, next) => {
    res.send('Hello, world!');
  });

  app.get('/api/search', (req, res, next) => {
    let db = app.db;
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
        info: app.flickrClient.getPhotoInfo(flickrId),
        images: app.flickrClient.getPhotoImage(flickrId)
      })
      .then(result => {
        let photo = result.info;
        photo.image = result.images.large;
        photo.thumbnail = result.images.thumbnail;
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

    app.flickrClient.search(query)
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

    app.db.table("photo").get(photoId).run()
      .then(photo => {
        res.json(photo)
      })
      .catch(next);
  });

  app.get('/w/1/i/:id', (req, res, next) => {
    let photoId = req.params.id;
    app.db.table("photo").get(photoId).getField("image").run()
      .then(image => {
        res.redirect(image.url);
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
