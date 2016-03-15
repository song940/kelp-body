'use strict';
const url  = require('url');
const mime = require('./mime');

module.exports = function(req, res, next){
  var u = url.parse(req.url, true);
  req.path  = u.pathname;
  req.query = u.query;

  req.text = '';
  req.body = mime(req).body;
  req.on('data', function(chunk){
    req.text += chunk;
  })
  .on('end', function(){
    req.data = new Buffer(req.text);
    next();
  });
};
