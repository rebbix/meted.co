var API = require('screenshot-capture');


class Screenshot {
  constructor(config, logger, cloudinary) {
    this.logger = logger;
    this.cloudinary = cloudinary;
    this.client = new API({
      access_key: config.accessKey,
      secret_key: config.secretKey,
      // secure: true
    })
  }

  capture(url) {
    let cloudinary = this.cloudinary;

    function saveScreenshot(screenshotData) {
      // TODO: This is crap!!!!
      // The stream should be piped
      // "Hack now, fix later" they said...
      return new Promise((resolve, reject) => {
        let stream = cloudinary.uploadStream(resolve);
        stream.write(screenshotData);
        stream.end();
      })
    }

    let query = {
      url: url,
      fullpage: 1,
      // Settings below force fetching of a fresh screenshot
      ttl: 0,
      force: 1
    };
    return this.client.capture(query)
      .then(saveScreenshot);
  }
}

module.exports = Screenshot;
