const fs           = require('fs');
const util         = require('util');
const Stream       = require('stream');

const CRLF        = '\n';
const HEADER      = 0;
const HEADER_END  = 1;
const CONTENT     = 2;
const CONTENT_END = 3;
const PART        = 4;
const PART_END    = 5;
const END         = 7;
/**
 * [Message description]
 * @param {[type]} obj     [description]
 * @param {[type]} content [description]
 */
function Message(obj, content){
  if(!(this instanceof Message))
    return new Message(obj, content);
  this.cursor = 0;
  this.headers = {};
  this.content = content || '';
  var self = this;
  if(obj instanceof Stream){
    var headers = obj.headers;
    if(headers){
      this.headers = headers;
      this.cursor  = CONTENT;
    }
    var data = '', parts = [];
    obj.on('data', function(chunk){
      data += chunk;
      parts = data.split(CRLF);
      data = parts.pop();
      parts.forEach(self.parse.bind(self));
    }).on('end', function(){
      data.split(CRLF).forEach(self.parse.bind(self));
    });
  }else if(typeof obj == 'string'){
    setTimeout(function(){
      obj.split(CRLF).forEach(self.parse.bind(self));
    }, 0);
  }else{
    this.headers = obj;
  }
};

util.inherits(Message, Stream);
/**
 * [function description]
 * @param  {[type]} name  [description]
 * @param  {[type]} value [description]
 * @return {[type]}       [description]
 */
Message.prototype.header = function(name, value){
  this.headers[ name ] = value;
  return this;
};
/**
 * [function description]
 * @param  {[type]} line [description]
 * @return {[type]}      [description]
 */
Message.prototype.parse = function(line){
  if(line == '') this.cursor++;
  if(/^--/ .test(line)) this.cursor = PART;
  if(/--$/ .test(line)) this.cursor = PART_END;
  console.log(this.cursor, line);
  switch(this.cursor) {
    case HEADER:
      var h = line.split(':');
      this.header(h[0], h[1]);
      break;
    case HEADER_END:
      this.cursor++;
      this.emit('header', this.headers);
      break;
    case CONTENT:
      this.content = line;
      break;
    case CONTENT_END:
      this.cursor++;
      this.emit('data', this.content);
      break;
    case PART:
      this.cursor = HEADER;
      break;
    case PART_END:
      this.cursor++;
      break;
    case END:
      this.emit('end');
      break;
    default:
      console.log(line);
  }
};
/**
 * [function description]
 * @return {[type]} [description]
 */
Message.prototype.toString = function(){
  var data = [];
  for(var name in this.headers){
    data.push([ name, this.headers[name] ].join(':'));
  }
  data.push('');
  data.push(this.content);
  return data.join(CRLF);
};

module.exports = Message;
