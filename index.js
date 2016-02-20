'use strict';
const url = require('url');

module.exports = function KelpBody(options){
  //
  return function(req, res, next){
    var u = url.parse(req.url);
    req.path = u.pathname;
    req.query = u.query;
    var buffer = [];
    req.on('data', function(chunk){
      buffer.push(chunk);
    }).on('error', function(){
      req.text = buffer.join('');
    });
    next();
  };
};
