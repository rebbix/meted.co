var _ = require('lodash');


const KNOWN_PHOTO_STOCKS = [
  '500px.com',
  'gettyimages.com',
  'bigstockphoto.com',
  'istockphoto.com',
  'shutterstock.com',
  'fotolia.com',
  'depositphotos.com',
  '123rf.com',
  'stock.adobe.com'
];
const RISK_TEXTS = [
  'N/A',
  'Low',
  'Medium',
  'High'
];

module.exports = (risks) => {
  // Not calculated yet, they are kinda async
  if (!risks) {
    return {
      score: 0,
      text: RISK_TEXTS[0],
      explanation: "Photo is not processed yet."
    }
  }

  let foundOnKnownPhotostocks = 0;
  _.each(risks.tinyEye.topLevelDomains, d => {
    if (_.includes(KNOWN_PHOTO_STOCKS, d)) {
      ++foundOnKnownPhotostocks;
    }
  })
  let stockPhotoRisk = (foundOnKnownPhotostocks > 0 ? true : false);
  let faceDetectedRisk = (risks.detectedFaces.count > 0 ? true : false);

  let result;
  if (stockPhotoRisk && faceDetectedRisk) {
    result = {
      score: 3,
      text: RISK_TEXTS[3],
      explanation: 'Photo found on major photo stocks, faces detected.'
    }
  } else if (stockPhotoRisk) {
    result = {
      score: 3,
      text: RISK_TEXTS[3],
      explanation: 'Photo found on major photo stocks'
    }
  } else if (faceDetectedRisk) {
    result = {
      score: 2,
      text: RISK_TEXTS[2],
      explanation: 'People faces detected on the photo.'
    }
  } else {
    result = {
      score: 1,
      text: RISK_TEXTS[1],
      explanation: 'No known risks detected.'
    }
  }
  return result;
}
