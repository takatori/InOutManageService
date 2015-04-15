/**
 * Extends standard http module.
 *
 * @author ne_Sachirou <utakata.c4se@gmail.com>
 * @license Public Domain
 * @module http
 */

'use strict';

var http = require('http');

/**
 * Wrapper for http.get() to get JSON resource.
 *
 * @example
 * var http = require('./http.js');
 * http.getJson('http://example.com/?format=json', function(error, data) {
 *   if (error) { console.log(error.stack); return; }
 *   // Process data here.
 * });
 *
 * @static
 * @param {string|Object} url
 * @param {function(?Error,?Object)} callback function(?Error,?Object)
 */
function getJson(url, callback) {
  var origCallback, req, error = null;

  origCallback = callback || function() { };
  callback = function(error, data) {
    origCallback(error, data);
    callback = function() { };
  };
  req = http.get(url, function(res) {
    var chunks = [ ];

    if (res.statusCode !== 200 && res.statusCode !== 0) {
      error = new Error(res.statusCode);
    }
    res.setEncoding('utf8');
    res.on('data', function(chunk) { chunks.push(chunk); });
    res.on('end', function() {
      var data = chunks.join('');

      try {
        data = JSON.parse(data);
      } catch (err) {
        error = err;
      }
      if (data && data.error) { error = new Error(data.error); }
      if (error) { callback(error, data); return; }
      callback(null, data);
    });
  });
  req.on('error', function(error) { callback(error, null); });
  req.setTimeout(10 * 1000, function() {
    req.abort();
    callback(error || new Error('Request timeout.'), null);
  });
}

http.getJson = getJson;
module.exports = http;
