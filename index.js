var bunyan = require('bunyan');
var http = require('http');
var config = require('./config');
var r = require('rethinkdbdash')({db: "meted"});
var Flickr = require('./lib/Flickr');
var Cloudinary = require('./lib/Cloudinary');
var createApp = require('./lib/app');

var logger = bunyan.createLogger({name: 'meted', level: config.logLevel})
var dependencies = {
  db: r,
  flickrClient: new Flickr(config.flickr.apiKey, logger),
  cloudinary: new Cloudinary(config.cloudinary, logger)
};
var app = createApp(config, logger, dependencies);

var server = http.createServer(app);

server.listen(config.http.port, config.http.host, function(err) {
  if (err) throw err;

  return logger.info(config.http, 'Application server started');
});
