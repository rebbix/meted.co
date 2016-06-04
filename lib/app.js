var express = require('express');
var setupRoutes = require('./routes');


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

  setupRoutes(app);

  app.use(errorLogger);
  if (config.env == 'development') {
    app.use(require('errorhandler')());
  } else {
    app.use(productionErrorHandler);
  }

  return app;
};
