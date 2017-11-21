const getRandomValues = require('get-random-values');
const atob = require('atob');
const CryptoJS = require('crypto-js');
import btoa from 'btoa';
import pako from 'pako';
//js native ArrayBuffer to Array of numbers
function ab2ba(ab){
  var view = new DataView(ab);
  var int_array = [];
  for(var i=0; i < view.byteLength; i++){
    int_array.push(view.getUint8(i));
  }
  return int_array;
}

function ba2ab(ba){
  var ab = new ArrayBuffer(ba.length);
  var dv = new DataView(ab);
  for(var i=0; i < ba.length; i++){
    dv.setUint8(i, ba[i]);
  }
  return ab;
}

function ba2ua(ba){
  var ua = new Uint8Array(ba.length);
  for (var i = 0; i < ba.length; i++) {
    ua[i] = ba[i];
  }
  return ua;
}

function ua2ba(ua){
  var ba = [];
  for (var i = 0; i < ua.byteLength; i++) {
    ba.push(ua[i]);
  }
  return ba;
}

/*CryptoJS only exposes word arrays of ciphertexts which is awkward to use
so we convert word(4byte) array into a 1-byte array*/
function wa2ba(wordArray) {
  var byteArray = [];
  for (var i = 0; i < wordArray.length; ++i) {
    var word = wordArray[i];
    for (var j = 3; j >= 0; --j) {
      byteArray.push((word >> 8 * j) & 0xFF);
    }
  }
  return byteArray;
}

//CryptoJS doesnt accept bytearray input but it does accept a hexstring
function ba2hex(bytearray){
  var hexstring = '';
  for(var i=0; i<bytearray.length; i++){
    var hexchar = bytearray[i].toString(16);
    if (hexchar.length == 1){
      hexchar = '0'+hexchar;
    }
    hexstring += hexchar;
  }
  return hexstring;
}

//convert a hex string into byte array
function hex2ba(str){
  var ba = [];
  //pad with a leading 0 if necessary
  if (str.length % 2){
    str = '0'+str;
  }
  for (var i = 0; i < str.length; i += 2) {
    ba.push(parseInt('0x' + str.substr(i, 2)));
  }
  return ba;
}

//Turn a max 4 byte array (big-endian) into an int. 
function ba2int( x ){
  assert(x.length <= 8, 'Cannot convert bytearray larger than 8 bytes');
  var retval = 0;
  for (var i=0; i<x.length; i++){
    retval |= x[x.length-1-i] << 8*i;
  }
  return retval;
}


//Turn an int into a bytearray. Optionally left-pad with zeroes
function bi2ba( x, args){
  assert(typeof(x) == 'number', 'Only can convert numbers');
  var fixed = null;
  if (typeof(args) !== 'undefined'){
    fixed = args.fixed;
  }
  var bytes = [];
  do {
    var onebyte = x & (255);
    x = x>>8;
    bytes = [].concat(onebyte, bytes);
  } while ( x !== 0 );
  var padding = [];
  if (fixed){
    for(var i=0; i < fixed-bytes.length; i++){
      padding = [].concat(padding, 0x00);
    }
  }
  return [].concat(padding,bytes);
}


//converts string to bytearray
function str2ba(str){
  if (typeof(str) !== 'string'){
    throw('Only type string is allowed in str2ba');
  }
  const ba = [];
  for(var i=0; i<str.length; i++){
    ba.push(str.charCodeAt(i));
  }
  return ba;
}

function ba2str(ba){
  if (typeof(ba) !== 'object'){
    throw('Only type object is allowed in ba2str');
  }
  var result = '';
  for (var i = 0; i < ba.length; i++) {
    result += String.fromCharCode(ba[i]);
  }
  return result;  
}


function hmac(key, msg, algo){
  var key_hex = ba2hex(key);
  var msg_hex = ba2hex(msg);
  var key_words = CryptoJS.enc.Hex.parse(key_hex);
  var msg_words = CryptoJS.enc.Hex.parse(msg_hex);
  var hash;
  if (algo === 'md5'){
    hash = CryptoJS.HmacMD5(msg_words, key_words);
    return wa2ba(hash.words);
  }
  else if (algo === 'sha1'){
    hash = CryptoJS.HmacSHA1(msg_words, key_words);
    return wa2ba(hash.words);
  }
}


function sha1(ba){
  var ba_obj = CryptoJS.enc.Hex.parse(ba2hex(ba));
  var hash = CryptoJS.SHA1(ba_obj);
  return wa2ba(hash.words);
}
function sha256(ba){
  var ba_obj = CryptoJS.enc.Hex.parse(ba2hex(ba));
  var hash = CryptoJS.SHA256(ba_obj);
  return wa2ba(hash.words);
}
function md5(ba){
  var ba_obj = CryptoJS.enc.Hex.parse(ba2hex(ba));
  var hash = CryptoJS.MD5(ba_obj);
  return wa2ba(hash.words);
}

//input bytearrays must be of equal length
function xor(a, b){
  assert(a.length === b.length, 'length mismatch');
  var c = [];
  for(var i=0; i<a.length; i++){
    c.push(a[i] ^ b[i]);
  }
  return c;
}


function assert(condition, message) {
  if (!condition) {
    throw message || 'Assertion failed';
  }
}

function isdefined(obj){
  assert(typeof(obj) !== 'undefined', 'obj was undefined');
}

  
function getRandom(number){
  //window was undefined in this context, so i decided to pass it explicitely
  var a = getRandomValues(new Uint8Array(number));
  //convert to normal array
  var b = Array.prototype.slice.call(a);
  return b;
}



function b64encode (aBytes) {
  return btoa(String.fromCharCode.apply(null, aBytes));
}


function b64decode (sBase64) {
  return atob(sBase64).split('').map(function(c) {
    return c.charCodeAt(0); });
}

//plaintext must be string
function dechunk_http(http_data){
  //'''Dechunk only if http_data is chunked otherwise return http_data unmodified'''
  const http_header = http_data.slice(0, http_data.search('\r\n\r\n')+'\r\n\r\n'.length);
  //#\s* below means any amount of whitespaces
  if (http_header.search(/transfer-encoding:\s*chunked/i) === -1){
    return http_data; //#nothing to dechunk
  }        
  var http_body = http_data.slice(http_header.length);
  
  var dechunked = http_header;
  var cur_offset = 0;
  var chunk_len = -1; //#initialize with a non-zero value
  while (true){  // eslint-disable-line no-constant-condition
    var new_offset = http_body.slice(cur_offset).search('\r\n');
    if (new_offset === -1){  //#pre-caution against endless looping
      //#pinterest.com is known to not send the last 0 chunk when HTTP gzip is disabled
      return dechunked;
    }
    let chunk_len_hex = http_body.slice(cur_offset, cur_offset+new_offset);
    chunk_len = parseInt(chunk_len_hex, 16);
    if (chunk_len === 0){
      break; //#for properly-formed html we should break here
    }
    cur_offset += new_offset + '\r\n'.length;
    dechunked += http_body.slice(cur_offset, cur_offset+chunk_len);
    cur_offset += chunk_len + '\r\n'.length;
  }  
  return dechunked;
}


function gunzip_http(http_data){
  var http_header = http_data.slice(0, http_data.search('\r\n\r\n') + '\r\n\r\n'.length);
  //#\s* below means any amount of whitespaces
  if (http_header.search(/content-encoding:\s*deflate/i) > -1){
    //#TODO manually resend the request with compression disabled
    throw('Please set gzip_disabled = 1 in tlsnotary.ini and rerun the audit');
  }
  if (http_header.search(/content-encoding:\s.*gzip/i) === -1){
    return http_data; //#nothing to gunzip
  }
  var http_body = http_data.slice(http_header.length);
  var ungzipped = http_header;
  if (!http_body){
  //HTTP 304 Not Modified has no body
    return ungzipped;
  }
  var inflated = pako.inflate(http_body);
  ungzipped += ba2str(inflated);
  return ungzipped;
}

function getTime(){
  var today = new Date();
  var time = today.getFullYear()+'-'+('00'+(today.getMonth()+1)).slice(-2)+'-'+('00'+today.getDate()).slice(-2)+'-'+ ('00'+today.getHours()).slice(-2)+'-'+('00'+today.getMinutes()).slice(-2)+'-'+('00'+today.getSeconds()).slice(-2);
  return time;
}

module.exports.ua2ba = ua2ba;
module.exports.ba2str = ba2str;
module.exports.ba2int = ba2int;
module.exports.ba2hex = ba2hex;
module.exports.hex2ba = hex2ba;
module.exports.bi2ba = bi2ba;
module.exports.b64decode = b64decode;
module.exports.b64encode = b64encode;
module.exports.getRandom = getRandom;
module.exports.str2ba = str2ba;
module.exports.hmac = hmac;
module.exports.xor = xor;
module.exports.wa2ba = wa2ba;
module.exports.dechunk_http = dechunk_http;
module.exports.gunzip_http = gunzip_http;
module.exports.ab2ba = ab2ba;
module.exports.ba2ab = ba2ab;
module.exports.ba2ua = ba2ua;
module.exports.sha1 = sha1;
module.exports.sha256 = sha256;
module.exports.md5 = md5;
module.exports.isdefined = isdefined;
module.exports.getTime = getTime;
