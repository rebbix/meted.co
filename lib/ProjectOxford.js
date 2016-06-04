var request = require('request-promise');
var _ = require('lodash');


const BASE_URL = 'https://api.projectoxford.ai/face/v1.0/detect';


class ProjectOxford {
  constructor(config, logger) {
    this.apiKey = config.apiKey;
    this.logger = logger;
  }

  detectFaces(url) {
    let params = {
      returnFaceId: true,
      returnFaceLandmarks: false
    };

    let options = {
      uri: BASE_URL,
      method: 'POST',
      qs: params,
      json: true,
      headers: {"Ocp-Apim-Subscription-Key": this.apiKey},
      body: {url}
    };

    let logger = this.logger;
    logger.trace({options}, 'Calling ProjectOxford API');
    return request(options)
      .then(response => {
        logger.trace({options, response}, 'ProjectOxford API response');
        return response;
      })
  }
}

module.exports = ProjectOxford;
