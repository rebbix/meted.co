module.exports = (app) => {
  app.get('/test.html', (req, res, next) => {
    let html = `<!doctype html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport"
            content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <title>Widget</title>
    </head>
    <body>
      <figure class="meted.co" data-meted-image-id="1" data-env-dev="1">
        <script src="https://app.meted.co/w.js"></script>
      </figure>
    </body>
    </html>`
  });

  [
    require('./api.js'),
    require('./widget.js')
  ].map(route => {
    route(app);
  });
};
