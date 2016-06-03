var express = require('express');
var Promise = require('bluebird');

var Flickr = require('./Flickr');


module.exports = (config, logger) => {
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
  app.flickrClient = new Flickr(config.flickr.apiKey, logger);

  app.get('/', (req, res, next) => {
    res.send('Hello, world!');
  });

  app.get('/api/search', (req, res, next) => {
    let query = req.query.q;

    app.flickrClient.search(query)
      .then(ids => {
        return Promise.map(ids, id => {
          return Promise.props({
            info: app.flickrClient.getPhotoInfo(id),
            images: app.flickrClient.getPhotoSizes(id)
          });
        })
      })
      .then(results => {
        res.json(results);
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
