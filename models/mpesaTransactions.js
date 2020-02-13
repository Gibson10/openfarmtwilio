'use strict';
/**
 * Product Model
 **/
var mongoose = require('mongoose');

 var mpesaSchema = new mongoose.Schema({
 CheckoutRequestID : String,
  phoneNumber: String,
  createdAt   : {
    type      : Date,
    default   : Date.now()
  },
  updatedAt   :  {
    type      : Date,
    default   : Date.now()
  },
});
module.exports = mongoose.model('mpesa', mpesaSchema);