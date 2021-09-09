'use strict';
const url = require('url');
const qs = require('querystring');
const MIME = require('mime2');

const readStream = stream => new Promise((resolve, reject) => {
  const buffer = [];
  stream
    .on('error', reject)
    .on('data', chunk => buffer.push(chunk))
    .on('end', () => resolve(Buffer.concat(buffer)))
});

/**
 * [function description]
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
module.exports = async (req, res, next) => {
  try {
    const o = url.parse(req.url, true);
    req.query = o.query;
    req.path = o.pathname;
    Object.assign(req, o);
  } catch (e) { };
  req.get = name => {
    if (!name) return;
    const key = name.toLowerCase();
    return req.headers[key];
  };
  req.data = await readStream(req);
  const contentType = req.get('Content-Type');
  const type = (contentType || '').split(';')[0];
  switch (type) {
    case 'text/plain':
      req.text = req.data.toString();
      break;
    case 'multipart/form-data':
      req.body = MIME.parse(req.data, contentType);
      break;
    case 'application/x-www-form-urlencoded':
      req.body = qs.parse(req.data);
      break;
    case 'application/json':
    case 'application/csp-report':
      req.body = JSON.parse(req.data);
      break;
  }
  return next();
};

