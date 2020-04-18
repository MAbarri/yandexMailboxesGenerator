const express = require('express');
const _ = require('underscore');
const app = express();
const subdomainRoute = express.Router();
const csvjson = require('csvjson');
const writeFile = require('fs').writeFile;
// Subdomain model
let Subdomain = require('../models/Subdomain');

// Add Subdomain
subdomainRoute.route('/subdomain/createMultiple').post((req, res, next) => {
  _.each(req.body.subdomains, function(subdomain){
    Subdomain.create(subdomain);
  })
    res.json("success")
});

// Add Subdomain
subdomainRoute.route('/subdomain/create').post((req, res, next) => {
  Subdomain.create(req.body, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
});

// Get All Subdomains
subdomainRoute.route('/exportExistingUsers').get((req, res) => {
  console.log('exportExistingUsers')
  Subdomain.find({}).lean().exec(function(err, data) {
    if (err) {
      return next(err)
    } else {
      let emails = [];
      _.each(data, function(item){
        emails = _.union(emails, _.map(data, function(subdomain){ return _.map(_.filter(subdomain.emails, function(mail){ return mail.login && mail.password}), function(email){ return {login: email.login+"@"+item.name, password: email.password}})}));
      })
      emails = _.flatten(emails);
      // console.log('emails', emails)
      const csvData = csvjson.toCSV(emails, {
          headers: 'key'
      });
      writeFile('./routes/test-data.csv', csvData, (err) => {
          if(err) {
              console.log(err); // Do something to handle the error or just throw it
              throw new Error(err);
          }
          console.log('Success!');
          const file = `${__dirname}/test-data.csv`;
          res.download(file); // Set disposition and send it.
        });
    }
  })
})
// Get All Subdomains
subdomainRoute.route('/subdomain/').get((req, res) => {
  Subdomain.find((error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

// Get single subdomain
subdomainRoute.route('/subdomain/read/:id').get((req, res) => {
  Subdomain.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})


// Update subdomain
subdomainRoute.route('/subdomain/update/:id').put((req, res, next) => {
  Subdomain.findByIdAndUpdate(req.params.id, {
    $set: req.body
  }, (error, data) => {
    if (error) {
      return next(error);
      console.log(error)
    } else {
      res.json(data)
      console.log('Data updated successfully')
    }
  })
})

// Delete subdomain
subdomainRoute.route('/subdomain/delete/:id').delete((req, res, next) => {
  Subdomain.findOneAndRemove(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.status(200).json({
        msg: data
      })
    }
  })
})

module.exports = subdomainRoute;
