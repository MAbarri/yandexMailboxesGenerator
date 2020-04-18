const express = require('express');
const _ = require('underscore');
const app = express();
const subdomainRoute = express.Router();
const https = require('https');
const axios = require('axios');
const async = require('async');
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

subdomainRoute.route('/createMultipleMailboxs').post((req, res, next) => {
  let originHost = JSON.parse(JSON.stringify(req.headers));
  // originHost.host = req.body.host;
  delete originHost.referer;
  delete originHost.host;

  let url = "https://"+req.body.host+req.body.path;
  let createdMails = [];
  var count = 0;
  async.whilst(
      function test(cb) { cb(null, count < 10); },
      function iter(callback) {
        console.log('left :', 1000-count);
          count++;
          let mailData = JSON.parse(JSON.stringify(req.body.body));

          mailData.login = makeid(6);
          mailData.password = makeid(10);
          createdMails.push({login: mailData.login, password: mailData.password});
          if(req.body.paramstype == "querystring") {
            _.each(_.keys(mailData), function(key, index){
              if(index == 0) url+="?";
              else url+="&";
              url+=key+"="+mailData[key];
            })
          }
          var options = {
            url: url,
            port: 80,
            method: req.body.method,
            headers: req.body.headers,
            data: mailData,
            rejectUnauthorized: false
          };
          options.headers['User-Agent'] = 'curl/7.21.4 (universal-apple-darwin11.0) libcurl/7.21.4 OpenSSL/0.9.8r zlib/1.2.5';
          axios(options)
          .then(function (response) {
            console.log('response', response.data)
            setTimeout(function() {
                callback(null, response.data);
            }, 5000);
          })
          .catch(function (error) {
            setTimeout(function() {
                callback(error);
              }, 5000);
          });

      },
      function (err, n) {
            Subdomain.findOneAndUpdate({name: req.body.body.domain}, {emails: createdMails}).exec(function(){
              res.json({err: err, n: n});
            })
      }
  );

});
function makeid(length) {
   var result           = '';
   var characters       = 'abcdefghijklmnopqrstuvwxyz0123456789'
   var charactersLength = characters.length
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
   }
   return result
}
module.exports = subdomainRoute;
