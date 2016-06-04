const LICENSES = {
  "4": {
    "flickrId": 4,
    "name": "Attribution License",
    "shortName": "CC-BY",
    "url": "https://creativecommons.org/licenses/by/2.0/"
  },
  "5": {
    "flickrId": 5,
    "name": "Attribution-ShareAlike License",
    "shortName": "CC-BY-SA",
    "url": "https://creativecommons.org/licenses/by-sa/2.0/"
  },
  "6": {
    "flickrId": 6,
    "name":"Attribution-NoDerivs License",
    "shortName": "CC-BY-ND",
    "url":"https://creativecommons.org/licenses/by-nd/2.0/"
  },
  "9": {
    "flickrId": 9,
    "name":"Public Domain Dedication (CC0)",
    "shortName": "CC0",
    "url":"https://creativecommons.org/publicdomain/zero/1.0/"
  }
};

module.exports = (licenseId) => {
  return LICENSES[licenseId.toString()];
}
