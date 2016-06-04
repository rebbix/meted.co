var Tineye = require('tineye-api')


class TinyEye {
  constructor(config, logger) {
    this.logger = logger;
    this.client = new Tineye('https://api.tineye.com/rest/', config.publicKey, config.privateKey);
  }

  search(url) {
    // function(url, offset, limit, sort, order, callback)
    let offset = 0;
    let limit = 300; // TODO: Change it ??
    let sort = "score";
    let order = "desc";

    return new Promise((resolve, reject) => {
      return this.client.search_url(url, offset, limit, sort, order, (result, err) => {
        if (err)
          return reject(err);
        resolve(result);
      });
    })
  }
}

module.exports = TinyEye;
