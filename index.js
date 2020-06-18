'use strict';
const URI  = require('url');
const qs   = require('querystring');
const MIME = require('mime2');

/**
 * [function description]
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
module.exports = function (req, res, next) {
  try {
    var url = URI.parse(req.url, true);
    req.query = url.query;
    req.path  = url.pathname;
    Object.assign(req, url);
    req.path = url.pathname;
  } catch (e) { };
  var contentType = req.headers['content-type'];
  var type = (contentType || '').split(';')[0];
  var buffer = Buffer.alloc(0);
  req.on('data', function (chunk) {
    console.log(chunk);
    buffer = Buffer.concat([buffer, chunk]);
  }).on('end', function () {
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
      case 'application/csp-report':
        req.body = JSON.parse(req.text);
        break;
    }
    next();
  });
};
