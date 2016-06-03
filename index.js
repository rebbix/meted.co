var bunyan = require('bunyan');
var http = require('http');
var r = require('rethinkdbdash')({db: "meted"});
var config = require('./config');
var createApp = require('./lib/app');

var logger = bunyan.createLogger({name: 'meted', level: config.logLevel})
var app = createApp(config, logger, r);

var server = http.createServer(app);

server.listen(config.http.port, config.http.host, function(err) {
  if (err) throw err;

  return logger.info(config.http, 'Application server started');
});

// function shutdown(signal) {
//   return () => {
//     logger.info(`Caught ${signal}, shutting down.`);
//     server.close( () => process.exit(0) )
//   }
// }
//
// // Graceful shutdown
// process.once('SIGTERM', shutdown('SIGTERM'));
// process.once('SIGINT', shutdown('SIGINT'));
