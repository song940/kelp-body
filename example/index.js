const http = require('http');
const kelp = require('kelp');
const body = require('../');

const app = kelp();

app.use(body);
app.use(function(req, res, next){
  console.log(req.body);
  console.log(req.files);
  // show a file upload form
  res.writeHead(200, {'content-type': 'text/html'});
  res.end(
    '<form action="/upload" enctype="multipart/form-data" method="post">'+
    '<input type="text" name="title"><br>'+
    '<input type="file" name="upload" multiple="multiple"><br>'+
    '<input type="submit" value="Upload">'+
    '</form>'
  );
});

const server = http.createServer(app).listen(4000);
