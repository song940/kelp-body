const http = require('http');
const kelp = require('kelp');
const body = require('..');

const app = kelp();

app.use([
  body,
  function (req, res, next) {
    if (req.path == '/upload') {
      const { body } = req;
      console.log(body);
      return res.end(JSON.stringify(body));
    }
    next();
  },
  function (req, res, next) {
    res.writeHead(200, { 'content-type': 'text/html' });
    res.end(
      '<form action="/upload" enctype="multipart/form-data" method="post">' +
      '<input type="text" name="title"><br>' +
      '<input type="file" name="upload" multiple="multiple"><br>' +
      '<input type="submit" value="Upload">' +
      '</form>'
    );
  }
]);

http.createServer(app).listen(4000);
