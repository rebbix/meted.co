var cloudinary = require('cloudinary');

class Cloudinary {
  constructor(config, logger) {
    this.logger = logger;
    this.client = cloudinary;
    this.client.config({
      cloud_name: config.cloudName,
      api_key: config.apiKey,
      api_secret: config.apiSecret
    });
  }

  uploadUrl(url) {
    let client = this.client;
    let logger = this.logger;
    return new Promise((resolve, reject) => {
      client.uploader.upload(url, (result) => {
        logger.trace({result}, 'Image uploaded to cloudinary');
        return resolve(result);
      })
    });
  }

  uploadStream(onResult) {
    return this.client.uploader.upload_stream(onResult);
  }

  getUrl(id, width, height) {
    return this.client.url(id, {secure: true, width: width, height: height, crop: "limit"});
  }
}

module.exports = Cloudinary;
