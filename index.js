'use strict';
const url = require('url');
const qs  = require('querystring');

module.exports = function(req, res, next){
  var u = url.parse(req.url, true);
  req.path  = u.pathname;
  req.query = u.query;
  
  var buffer = [];
  req.on('data', function(chunk){
    buffer.push(chunk);
  })
  .on('end', function(){
    req.data = buffer;
    req.text = buffer.join('');
    switch((req.headers['content-type'] || '').split(';')[0]){
      case 'application/x-www-form-urlencoded':
        req.body = qs.parse(req.text);
        break;
      case 'application/json':
        req.body = JSON.parse(req.text);
        break;
      case 'multipart/form-data':
        console.log(req.text);
      case 'text/plain':
      default:
        break;
    }
    next();
  });
};
