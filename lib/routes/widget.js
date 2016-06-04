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

      // TODO: Do flickr image urls expire?
      // We may have a problem here!
      return app.locals.tinyEye.search(photo.largeThumbnail.url)
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

    function detectFaces(photo) {
      if (photo.detectedFaces) // already calculated
        return Promise.resolve()

      return app.locals.projectOxford.detectFaces(photo.largeThumbnail.url)
        .then(faces => {
          faces = faces || [];
          return db.table("photo").get(photo.id).update({risks: {detectedFaces: {count: faces.length}}}).run()
        })
        .catch(err => {
          // INTENTIONAL! We do not wait for db response
          // It is semi-OK if some views are not counted
          logger.error({err, photoId: photo.id}, 'Error while Calculating risks');
        });
    }

    function captureScreenshot(photo) {
      if (photo.screenshot) // already calculated
        return Promise.resolve()

      return app.locals.screenshot.capture(photo.url)
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
        captureScreenshot(photo);
        detectFaces(photo);

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

    const KNOWN_PHOTO_STOCKS = [
      '500px.com',
      'gettyimages.com',
      'bigstockphoto.com',
      'istockphoto.com',
      'shutterstock.com',
      'fotolia.com',
      'depositphotos.com',
      '123rf.com',
      'stock.adobe.com'
    ];
    const RISK_TEXTS = [
      'N/A',
      'Low',
      'Medium',
      'High'
    ];
    function calculateRiskScores(risks) {
      // Not calculated yet, they are kinda async
      if (!risks) {
        return {
          score: 0,
          text: RISK_TEXTS[0],
          explanation: "Photo is not processed yet."
        }
      }

      let foundOnKnownPhotostocks = 0;
      _.each(risks.tinyEye.topLevelDomains, d => {
        if (_.find(KNOWN_PHOTO_STOCKS, d)) {
          ++foundOnKnownPhotostocks;
        }
      })
      let stockPhotoRisk = (foundOnKnownPhotostocks > 0 ? true : false);
      let faceDetectedRisk = (risks.detectedFaces.count > 0 ? true : false);

      let result;
      if (stockPhotoRisk && faceDetectedRisk) {
        result = {
          score: 3,
          text: RISK_TEXTS[3],
          explanation: 'Photo found on major photo stocks, faces detected.'
        }
      } else if (stockPhotoRisk) {
        result = {
          score: 3,
          text: RISK_TEXTS[3],
          explanation: 'Photo found on major photo stocks'
        }
      } else if (faceDetectedRisk) {
        result = {
          score: 2,
          text: RISK_TEXTS[2],
          explanation: 'People faces detected on the photo.'
        }
      } else {
        result = {
          score: 1,
          text: RISK_TEXTS[1],
          explanation: 'No known risks detected.'
        }
      }
      return result;
    }

    let photoId = req.params.id;
    app.locals.db.table("photo").get(photoId).pluck("license", "owner", "risks", "url").default(null).run()
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
          id: photo.id,
          license: licenses(photo.license),
          author: {
            name: photo.owner.realName || photo.owner.userName,
            url: `https://www.flickr.com/photos/${photo.owner.id}` // TODO: Fetch from API
          },
          url: photo.url,
          riskLevel: calculateRiskScores(photo.risks),
          debug: {
            risks: photo.risks
          }
        });
      })
      .catch(next);
  });
};
