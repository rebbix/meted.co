var express = require('express');
var uuid    = require('node-uuid');
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
  app.logger = logger;
  app.locals = dependencies;

  app.use((req, res, next) => {
    var reqId = uuid.v1();
    req.log = app.logger.child({req_id: reqId});
    next();
  });
  app.use((req, res, next) => {
    var log = req.log || app.logger;
    log.info({req}, 'HTTP');
    next();
  });

  setupRoutes(app);

  app.use(errorLogger);
  if (config.env == 'development') {
    app.use(require('errorhandler')());
  } else {
    app.use(productionErrorHandler);
  }

  return app;
};
