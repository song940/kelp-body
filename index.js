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
  var u     = url.parse(req.url, true);
  req.path  = u.pathname;
  req.query = u.query;

  var contentType = req.headers[ 'content-type' ];
  var type = (contentType || '').split(';')[0];
  var buffer = new Buffer([]);
  req.on('data', function(chunk){
    buffer = Buffer.concat([ buffer, chunk ]);
  }).on('end', function(){
    req.data = buffer;
    switch (type) {
      case 'multipart/form-data':
        req.body = MIME.parse(req.data, contentType);
        break;
      case 'application/x-www-form-urlencoded':
        req.body = qs.parse(req.text);
        break;
      case 'json':
      case 'application/json':
        req.body = JSON.parse(req.text);
        break;
      case 'text/plain':
        req.text = buffer.toString();
        break;
    }
    next();
  });

};
