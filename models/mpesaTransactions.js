'use strict';
/**
 * Product Model
 **/
var mongoose = require('mongoose');

 var mpesaSchema = new mongoose.Schema({
  orderRef : String,
  phoneNumber: String,
  customerName:String,
  vendorNumber:String,
  vendorName:String,
  productName:String,
  productPrice:String,
  twilioNumber:String,
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