'use strict';
const url  = require('url');
const qs   = require('querystring');
const MIME = require('mail2/mime');

MIME.CRLF = '\r\n';

/**
 * [function description]
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
module.exports = function(req, res, next){
  try{
    var u = url.parse(req.url, true);
    req.path  = u.pathname;
    req.query = u.query;
  }catch(e){};
  var contentType = req.headers[ 'content-type' ];
  var type = (contentType || '').split(';')[0];
  var buffer = new Buffer([]);
  req.on('data', function(chunk){
    buffer = Buffer.concat([ buffer, chunk ]);
  }).on('end', function(){
    req.data = buffer;
    req.text = buffer.toString();
    switch (type) {
      case 'text/plain':
        break;
      case 'multipart/form-data':
        req.body = MIME.parse(req.data, contentType);
        break;
      case 'application/x-www-form-urlencoded':
        req.body = qs.parse(req.text);
        break;
      case 'application/json':
        req.body = JSON.parse(req.text);
        break;
    }
    next();
  });
};