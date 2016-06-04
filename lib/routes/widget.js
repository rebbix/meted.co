var _ = require('lodash');
var licenses = require('../licenses');


module.exports = (app) => {
  app.get('/w/1/i/:id/:width,:height', (req, res, next) => {
    let db = app.locals.db;
    let cloudinary = app.locals.cloudinary;
    let logger = app.logger;

    let photoId = req.params.id;
    let width = req.params.width;
    let height = req.params.height;

    function increaseViewCount(photo) {
      // Increase view count
      return db.table("photo").get(photo.id).update({viewCount: db.row("viewCount").add(1).default(0)}).run()
        .catch(err => {
          // INTENTIONAL! We do not wait for db response
          // It is semi-OK if some views are not counted
          logger.error({err, photoId: photo.id}, 'Error while increasing view count');
        });
    }

    function calculateRisks(photo) {
      if (photo.risks && photo.risks.tinyEye) // already calculated
        return Promise.resolve()

      // TODO: What is a best resolution?
      // TODO: In most cases this will be a first view of a pic in the resolution, hence processing time will increase
      let maxWidth = 1000;
      let maxHeight = 1000;
      let photoUrl = cloudinary.getUrl(photo.image.cloudinaryId, maxWidth, maxHeight);
      return app.locals.tinyEye.search(photoUrl)
        .then(result => {
          // Calculate scores
          let matches = _.get(result, 'results.matches');
          let topLevelDomainMatches = [];
          _.each(matches, match => {
            if (match["top_level_domain"])
              topLevelDomainMatches.push(match["top_level_domain"]);
          });
          topLevelDomainMatches = _.uniq(topLevelDomainMatches);

          return {
            // TODO: Other domain matches???
            total: _.get(result, 'results.total_results'),
            topLevelDomains: topLevelDomainMatches
          }
        })
        .then(risks => {
          return db.table("photo").get(photo.id).update({risks: {tinyEye: risks}}).run()
        })
        .catch(err => {
          // INTENTIONAL! We do not wait for db response
          // It is semi-OK if some views are not counted
          logger.error({err, photoId: photo.id}, 'Error while Calculating risks');
        });
    }

    db.table("photo").get(photoId).default(null).run()
      .then(photo => {
        if (photo == null) {
          let err = new Error('Not Found');
          err.status = 404;
          return Promise.reject(err);
        } else {
          return photo;
        }
      })
      .then(photo => {
        // INTENTIONAL! We do not wait for promises to resolve
        // A poor man's async :)
        // TODO: Move to some kind of a queue
        increaseViewCount(photo);
        calculateRisks(photo);

        return photo.image;
      })
      .then(image => {
        if (image.cloudinaryId) { // already uploaded to cloudinary
          return image.cloudinaryId;
        } else { // upload to cloudinary
          return cloudinary.uploadUrl(image.url)
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

  app.get('/w/1/:id', (req, res, next) => {
    let logger = app.logger;

    let photoId = req.params.id;
    app.locals.db.table("photo").get(photoId).pluck("license", "owner").default(null).run()
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
        res.json({
          license: licenses(photo.license),
          author: {
            name: photo.owner.realName || photo.owner.userName,
            url: `https://www.flickr.com/photos/${photo.owner.id}` // TODO: Fetch from API
          },
          riskLevel: "Low" // TODO: Calculate!!!
        });
      })
      .catch(next);
  });
};
