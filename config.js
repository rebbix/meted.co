var config = module.exports;

config.env = process.env.NODE_ENV;
config.logLevel = process.env.LOG_LEVEL || 'debug';
config.http = {
  port: process.env.PORT || 5000,
  host: process.env.HOST || 'localhost'
};
config.flickr = {
  apiKey: 'f613a247687d80e07ab320c36cd02adb'
};
