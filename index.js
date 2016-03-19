'use strict';
const url        = require('url');
const qs         = require('querystring');
const multiparty = require('multiparty');
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
  if(contentType) contentType = contentType.split(';')[0];
  /**
   * [parse description]
   * @return {[type]} [description]
   */
  function parse(){
    switch (contentType) {
      case 'multipart/form-data':
        break;
      case 'application/x-www-form-urlencoded':
        req.body = qs.parse(req.text);
        next();
        break;
      case 'json':
      case 'application/json':
        req.body = JSON.parse(req.text);
        next();
        break;
      default:
        next();
        break;
    }
  };
  /**
   * [description]
   */
  if(contentType == 'multipart/form-data'){
    var form = new multiparty.Form();
    form.parse(req, function(err, fields, files) {
      if(err) return next(err);
      req.body = fields;
      req.files = files;
      next();
    });
  }else{
    var buffer = new Buffer([]);
    req.on('data', function(chunk){
      buffer = Buffer.concat([ buffer, chunk ]);
    }).on('end', function(){
      req.data = buffer;
      req.text = buffer.toString();
      parse();
    });
  }

};
