const http = require('http');
const kelp = require('kelp');
const body = require('../');

const app = kelp();

app.use(body);

app.use(function(req, res, next){
  res.setHeader('Content-Type', 'text/html');
  res.end('<form method="post"><input name="user" type="text" /><input type="submit" /></form>');
});

const server = http.createServer(app).listen(4000);
