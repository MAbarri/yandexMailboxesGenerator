const express = require('express');
const _ = require('underscore');
const app = express();
const subdomainRoute = express.Router();
const https = require('https');
const axios = require('axios');
var fs = require('fs');
// Subdomain model
let Subdomain = require('../models/Subdomain');

// Add Subdomain
subdomainRoute.route('/makeExternalCall').post((req, res, next) => {
  let originHost = JSON.parse(JSON.stringify(req.headers));
  // originHost.host = req.body.host;
  delete originHost.referer;
  delete originHost.host;
  // var options = {
  //   hostname: req.body.host,
  //   port: 80,
  //   path: req.body.path,
  //   method: req.body.method,
  //   headers: req.body.headers,
  //   body: req.body.body,
  //   rejectUnauthorized: false
  // };
  let url = "https://"+req.body.host+req.body.path;
  if(req.body.paramstype == "querystring") {
    _.each(_.keys(req.body.body), function(key, index){
      if(index == 0) url+="?";
      else url+="&";
      url+=key+"="+req.body.body[key];
    })
  }
  var options = {
    url: url,
    port: 80,
    method: req.body.method,
    headers: req.body.headers,
    data: req.body.body,
    rejectUnauthorized: false
  };
  options.headers['User-Agent'] = 'curl/7.21.4 (universal-apple-darwin11.0) libcurl/7.21.4 OpenSSL/0.9.8r zlib/1.2.5';
  console.log('options', options)
  axios(options)
  .then(function (response) {

      res.json(response.data);
  })
  .catch(function (error) {
        res.json(error.response.data);
  });

});

module.exports = subdomainRoute;
