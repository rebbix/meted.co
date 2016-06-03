var request = require('request-promise');
var _ = require('lodash');


const BASE_URL = 'https://api.flickr.com/services/rest/';


class Flickr {
  constructor(apiKey, logger) {
    this.baseParams = {
      api_key: apiKey,
      format: 'json',
      nojsoncallback: 1
    };
    this.logger = logger;
  }

  search(query) {
    let params = {
      method: 'flickr.photos.search',
      text: query,
      license: '4,5,6,9', // free licenses only
      privacy_filter: 1, // public only
      safe_search: 1, // safe only
      content_type: 1, // photos only
      media: 'photos', // no videos
      per_page: 10 // for testing, change later
    };
    return this._request(params)
      .then(response => {
        let photos = _.get(response, 'photos.photo', []);
        return _.map(photos, p => p.id);
      })
  }

  getPhotoInfo(photoId) {
    let params = {
      method: 'flickr.photos.getInfo',
      photo_id: photoId
    };

    return this._request(params)
      .then(response => {
        let p = response.photo;
        let urls = _.get(p, 'urls.url', [])
        let photoPageUrl = _.find(urls, url => {
          return url.type == "photopage";
        });
        return {
          flickrId: p.id.toString(),
          title: _.get(p, 'title._content', ''),
          description: _.get(p, 'description._content', ''),
          license: p.license.toString(),
          url: photoPageUrl ? photoPageUrl._content : null,
          owner: {
            id: _.get(p, 'owner.nsid'),
            username: _.get(p, 'owner.username'),
            realName: _.get(p, 'owner.realname')
          }
        };
      })
  }

  getPhotoImage(photoId) {
    let params = {
      method: "flickr.photos.getSizes",
      photo_id: photoId
    };

    let logger = this.logger;
    // TODO: Store thumbnail URL
    // Thumbnail is best suitable image size from available
    return this._request(params)
      .then(response => {

        let sizes = _.get(response, 'sizes.size', []);
        sizes = _.filter(sizes, {media: "photo"}) // photo thumbnails only
        sizes = _.sortBy(sizes, s => parseInt(s.height)); // sort
        let largestSize = sizes[sizes.length - 1]; // last one is biggest
        let thumbnail = _.find(sizes, s => {
          return parseInt(s.height) >= 240; // a thumbnail is a smallest size image greater or equal to 240px in height
        });

        return {
          large: {
            url: largestSize.source,
            width: parseInt(largestSize.width),
            height: parseInt(largestSize.height)
          },
          thumbnail: {
            url: thumbnail.source,
            width: parseInt(thumbnail.width),
            height: parseInt(thumbnail.height)
          }
        }
      });
  }

  _request(params) {
    let options = {
      uri: BASE_URL,
      qs: _.extend(params, this.baseParams),
      json: true
    };

    let logger = this.logger;
    logger.trace({options}, 'Calling Flickr API');
    return request(options)
      .then(response => {
        logger.trace({options, response}, 'Flickr API response');
        return response;
      })
  }
}

module.exports = Flickr;


// Flickr licenses
// [
//   {
//     "id":"4",
//     "name":"Attribution License",
//     "url":"https://creativecommons.org/licenses/by/2.0/"
//   },
//   {
//     "id":"5",
//     "name":"Attribution-ShareAlike License",
//     "url":"https://creativecommons.org/licenses/by-sa/2.0/"
//   },
//   {
//     "id":"6",
//     "name":"Attribution-NoDerivs License",
//    CC-BY-ND
//     "url":"https://creativecommons.org/licenses/by-nd/2.0/"
//   },
//   {
//     "id":"9",
// CC0
//     "name":"Public Domain Dedication (CC0)",
//     "url":"https://creativecommons.org/publicdomain/zero/1.0/"
//   },
//   {
//     "id":"10",
//     Public Domain
//     "name":"Public Domain Mark",
//     "url":"https://creativecommons.org/publicdomain/mark/1.0/"
//   }
// ]
