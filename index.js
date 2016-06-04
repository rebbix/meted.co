var bunyan = require('bunyan');
var http = require('http');
var config = require('./config');
var r = require('rethinkdbdash')({db: "meted"});
var Flickr = require('./lib/Flickr');
var Cloudinary = require('./lib/Cloudinary');
var Screenshot = require('./lib/Screenshot');
var TinyEye = require('./lib/TinyEye');
var createApp = require('./lib/app');

var logger = bunyan.createLogger({name: 'meted', level: config.logLevel})
let cloudinary = new Cloudinary(config.cloudinary, logger);
var dependencies = {
  db: r,
  flickrClient: new Flickr(config.flickr.apiKey, logger),
  cloudinary: cloudinary,
  screenshot: new Screenshot(config.screenshotLayer, logger, cloudinary),
  tinyEye: new TinyEye(config.tinyEye, logger)
};
var app = createApp(config, logger, dependencies);

var server = http.createServer(app);

server.listen(config.http.port, config.http.host, function(err) {
  if (err) throw err;

  return logger.info(config.http, 'Application server started');
});
