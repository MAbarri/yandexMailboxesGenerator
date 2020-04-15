const express = require('express');
const _ = require('underscore');
const app = express();
const subdomainRoute = express.Router();

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
