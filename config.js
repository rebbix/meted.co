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
config.cloudinary = {
  cloudName: 'meted-co',
  apiKey: '795426656763274',
  apiSecret: 'UTuY7VpX2feRBzUzgFcVoaHU6Oc'
};
config.screenshotLayer = {
  accessKey: "83d75104a9fd8a63059953b45a5c8916",
  // secretKey: "",
  // secure: true
};
config.tinyEye = {
  // The defaults are a keys of API sandbox
  publicKey: process.env.TINYEYE_PUBLIC_KEY || "LCkn,2K7osVwkX95K4Oy",
  privateKey: process.env.TINYEYE_PRIVATE_KEY || "6mm60lsCNIB,FwOWjJqA80QZHh9BMwc-ber4u=t^",
  baseUrl: "https://api.tineye.com/rest/"
};
config.projectOxford = {
  apiKey: "3ada40786fda457d80787b2c20f0c1c8"
};
