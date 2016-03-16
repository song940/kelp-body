'use strict';
const url        = require('url');
const multiparty = require('multiparty');
module.exports = function(req, res, next){
  var u = url.parse(req.url, true);
  req.path  = u.pathname;
  req.query = u.query;

  req.text = '';
  // parse a file upload
  var form = new multiparty.Form();
  form.parse(req, function(err, fields, files) {
    req.body = fields;
    req.files = files;
    next();
  });
};
