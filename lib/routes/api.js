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


module.exports = (app) => {
  app.get('/api/search', (req, res, next) => {
    let db = app.locals.db;
    function getPhotoFromDb(flickrId) {
      return db.table("photo").getAll(flickrId, {index: "flickrId"}).nth(0).default(null).run();
    }

    function storePhoto(photo) {
      // TODO: NON ATOMIC! Same photos may be inserted twice in rare cases
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

  app.get('/api/screenshot/:photoId', (req, res, next) => {
    let db = app.locals.db;
    let screenshot = app.locals.screenshot;
    let logger = app.logger;

    let photoId = req.params.photoId;

    function captureAndSaveScreenshot(photo) {
      return screenshot.capture(photo.url)
        .then(res => {
          return {
            cloudinaryId: res.public_id,
            url: res.secure_url
          }
        })
        .then(screenshot => {
          // save to DB
          db.table("photo").get(photo.id).update({screenshot: screenshot})
            .catch(err => {
              // INTENTIONAL! We do not wait for db response
              // It is OK if some views are not counted
              logger.error({err}, 'Error while increasing view count');
            });
          return screenshot;
        })
    }

    db.table("photo").get(photoId).default(null).run()
      .then(photo => {
        if (photo === null) {
          let err = new Error('Not Found');
          err.status = 404;
          return Promise.reject(err);
        } else {
          return photo;
        }
      })
      .then(photo => {
        if (photo.screenshot) {
          return photo.screenshot;
        } else {
          return captureAndSaveScreenshot(photo);
        }
      })
      .then(screenshot => {
        res.json(screenshot);
      })
      .catch(next);
  });
}
