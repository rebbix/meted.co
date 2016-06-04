module.exports = (app) => {
  [
    require('./api.js'),
    require('./widget.js')
  ].map(route => {
    route(app);
  });
};
