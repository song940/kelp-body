const http = require('http');
const kelp = require('kelp');
const body = require('../');

const app = kelp();

app.use(body);

app.use(function(req, res, next){
  console.log('----------------------------');
  console.log('url\r\t\t='    , req.url);
  console.log('path\r\t\t='   , req.path);
  console.log('query\r\t\t='  , req.query);
  console.log('text\r\t\t='   , req.text);
  console.log('body\r\t\t='   , req.body);
  console.log('----------------------------');
  res.end('kelp-body');
});

const server = http.createServer(app).listen(4000);
