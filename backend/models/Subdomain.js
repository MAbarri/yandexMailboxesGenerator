const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema
let Subdomain = new Schema({
   name: {
      type: String,
      required: true,
      unique: true
   },
   status: {
      type: String
   },
   emails: [{
      login: String,
      password: String
   }]
}, {
   collection: 'subdomains'
})

module.exports = mongoose.model('Subdomain', Subdomain)
