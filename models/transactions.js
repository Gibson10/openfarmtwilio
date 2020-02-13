'use strict';
/**
 * Product Model
 **/
var mongoose = require('mongoose');

 var transactionsSchema = new mongoose.Schema({
  customerName:String,
  pricePaid: String,
  transactionType    : String,
  vendorName:String,
  vendorLocation: String,
  vendorPhone:String,
  productName:String,
  productQuantity:String,
  createdAt   : {
    type      : Date,
    default   : Date.now()
  },
  updatedAt   :  {
    type      : Date,
    default   : Date.now()
  },
});
module.exports = mongoose.model('transactions', transactionsSchema);