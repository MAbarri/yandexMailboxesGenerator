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
var faker = require('faker');
faker.locale = "en";
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

  mailData.iname = faker.name.firstName();
  mailData.fname = faker.name.lastName();
  mailData.birth_date = faker.random.number({min:1979, max:2000})+"-"+faker.random.number({min:1, max:12})+"-"+faker.random.number({min:1, max:29});
  mailData.sex = faker.random.number({min:0, max:1});


  if(req.body.paramstype == "querystring") {
    _.each(_.keys(mailData), function(key, index){
      if(index == 0) url+="?";
      else url+="&";
      url+=key+"="+mailData[key];
    })
  }

  createdMails.push({login: mailData.login, password: mailData.password, iname: mailData.iname, fname: mailData.fname, birth_date: mailData.birth_date, sex: mailData.sex});
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
ExternalApiRoute.route('/experimental').get((req, res, next) => {
  Subdomain.find({}).exec(function(err, subdomains){
    async.mapSeries(subdomains, function(subdomain, callbackSenders) {
      _.each(subdomain.emails, function(email){
        if(!email.iname) email.iname = faker.name.firstName();
        if(!email.fname) email.fname = faker.name.lastName();
        if(!email.birth_date) email.birth_date = faker.random.number({min:1979, max:2000})+"-"+faker.random.number({min:1, max:12})+"-"+faker.random.number({min:1, max:29});
        if(!email.sex) email.sex = faker.random.number({min:0, max:1});
      })
      Subdomain.findOneAndUpdate({_id: subdomain._id}, subdomain).exec(function(){
        callbackSenders();
      })
    }, function(err, allResponses) {
      res.json({response: "success"});
    });
  })
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
      async.mapSeries(receiversEmails.splice(counter, 10), function(receiver, callback) {
        nodeMailer.sendMail(email, receiver, subject, template,  function(status){
          callback(null, status);
        })
      }, function(err, responses) {
        counter+=10;
        callbackSenders(null, responses);
      });
    } else
    callbackSenders();

  }, function(err, allResponses) {
    allResponses = _.flatten(_.filter(allResponses, function(item){return !!item}))
    var returnObject = _.map(allResponses, function(res){
      var ret = {sender: res.mailOptions.from, client: res.mailOptions.to};
      if(res.error)  ret.response = res.error.response;
      if(res.response)  ret.response = res.response.response;
      if(res.error && res.error.response.indexOf('Please accept EULA first') != -1)
        ret.status = 'EULA';
      else if(res.error && res.error.response.indexOf("Invalid user or password") != -1)
        ret.status = 'AUTHENTICATION';
      else if(res.error && res.error.response.indexOf("Message rejected under suspicion of SPAM") != -1)
        ret.status = 'SPAM';
      else if(res.response && res.response.response.indexOf("Ok") != -1)
        ret.status = "SUCCESS";
      if(res.error && !ret.status) {
        ret.status = "UNKNOWN ERROR";
        ret.data = res.error;
      }
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
