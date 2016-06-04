var _ = require('lodash');
var Promise = require('bluebird');
var licenses = require('../licenses');


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
          r.license = licenses(r.license);
          return r;
        })
      })
      .then(results => {
        res.json(results);
      })
      .catch(next);
  });

  // TODO: Not used for now.
  // app.get("/api/photo/:photoId", (req, res, next) => {
  //   var photoId = req.params.photoId;
  //
  //   app.locals.db.table("photo").get(photoId).run()
  //     .then(photo => {
  //       res.json(photo)
  //     })
  //     .catch(next);
  // });
}