const express = require('express');
const _ = require('underscore');
const app = express();
const subdomainRoute = express.Router();
const https = require('https');

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
    headers: _.extend(req.body.headers, originHost),
    body: req.body.body
  };
  console.log('options', options)
  https.request(options, function(httpres) {
    httpres.setEncoding('utf8');
    httpres.on('data', function (chunk) {
      res.json(chunk)
    });
  }).end();
});

module.exports = subdomainRoute;
