const express = require('express');
const _ = require('underscore');
const app = express();
const subdomainRoute = express.Router();
const https = require('https');
https.globalAgent.options.secureProtocol = 'SSLv3_method'
var fs = require('fs');
// Subdomain model
let Subdomain = require('../models/Subdomain');

// Add Subdomain
subdomainRoute.route('/makeExternalCall').post((req, res, next) => {
  let originHost = JSON.parse(JSON.stringify(req.headers));
  // originHost.host = req.body.host;
  delete originHost.referer;
  delete originHost.host;
  var options = {
    hostname: req.body.host,
    port: 80,
    path: req.body.path,
    method: req.body.method,
    headers: req.body.headers,
    body: req.body.body,
    rejectUnauthorized: false
  };
  options.headers['User-Agent'] = 'curl/7.21.4 (universal-apple-darwin11.0) libcurl/7.21.4 OpenSSL/0.9.8r zlib/1.2.5';
  console.log('options', options)
  https.request(options, function(httpres) {
    httpres.setEncoding('utf8');
    httpres.on('data', function (chunk) {
      res.json(chunk)
    });
  }).end();
});

module.exports = subdomainRoute;
