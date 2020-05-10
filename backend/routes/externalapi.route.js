const express = require('express');
const async = require('async');

const nodeMailer = require('../helpers/mailer');
const _ = require('underscore');
const app = express();
const ExternalApiRoute = express.Router();
const https = require('https');
const axios = require('axios');
var fs = require('fs');
const { Parser } = require('json2csv');
// Subdomain model
let Subdomain = require('../models/Subdomain');

// Add Subdomain
ExternalApiRoute.route('/makeExternalCall').post((req, res, next) => {
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
    if(req.body.paramstype == "querystring") {
      _.each(_.keys(req.body.body), function(key, index){
        if(index == 0) url+="?";
        else url+="&";
        url+=key+"="+req.body.body[key];
      })
    }
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

ExternalApiRoute.route('/createMultipleMailboxs').post((req, res, next) => {
  let originHost = JSON.parse(JSON.stringify(req.headers));
  // originHost.host = req.body.host;
  delete originHost.referer;
  delete originHost.host;

  let url = "https://"+req.body.host+req.body.path;
  let createdMails = [];

  let mailData = JSON.parse(JSON.stringify(req.body.body));

  mailData.login = makeid(6);
  mailData.password = makeid(10);

  if(req.body.paramstype == "querystring") {
    _.each(_.keys(mailData), function(key, index){
      if(index == 0) url+="?";
      else url+="&";
      url+=key+"="+mailData[key];
    })
  }

  createdMails.push({login: mailData.login, password: mailData.password});
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
        Subdomain.findOneAndUpdate({name: req.body.body.domain}, {"$push": {emails: createdMails}}).exec(function(){
          console.log('response.data', response.data)
          res.json({response: response.data});
        })
  })
  .catch(function (error) {
    res.json({error: error});
  });

});
ExternalApiRoute.route('/updateMultipleMailboxs').post((req, res, next) => {
  let originHost = JSON.parse(JSON.stringify(req.headers));
  // originHost.host = req.body.host;
  delete originHost.referer;
  delete originHost.host;

  let url = "https://"+req.body.host+req.body.path;
  let createdMails = [];

  let mailData = JSON.parse(JSON.stringify(req.body.body));

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
          console.log('response.data', response.data)
          res.json({response: response.data});
  })
  .catch(function (error) {
    res.json({error: error});
  });

});
ExternalApiRoute.route('/sendEmails').post((req, res, next) => {
  let originalEmails = req.body.emails;
  let receiversEmails = req.body.receivers;
  let template = req.body.template;
  let subject = req.body.subject;
  var counter = 0;
  async.mapSeries(originalEmails, function(email, callbackSenders) {
    if(counter<receiversEmails.length) {
      async.mapSeries(receiversEmails.splice(counter, 4), function(receiver, callback) {
        nodeMailer.sendMail(email, receiver, subject, template,  function(status){
          callback(null, status);
        })
      }, function(err, responses) {
        counter+=4;
        callbackSenders(null, responses);
      });
    } else
    callbackSenders();

  }, function(err, allResponses) {
    allResponses = _.flatten(_.filter(allResponses, function(item){return !!item}))
    var returnObject = _.map(allResponses, function(res){
      var ret = {sender: res.mailOptions.from, client: res.mailOptions.to};
      if(res.error && res.error.response.indexOf('Please accept EULA first'))
        ret.status = 'EULA';
      if(res.error && res.error.response.indexOf("Invalid user or password"))
        ret.status = 'AUTHENTICATION';
      if(res.response && res.response.response.indexOf("Ok"))
        ret.status = "SUCCESS";
      return ret;
    })
    res.json({responses: returnObject});
  });

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
module.exports = ExternalApiRoute;
