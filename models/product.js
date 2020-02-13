'use strict';
/**
 * Product Model
 **/
var mongoose = require('mongoose');

 var productsSchema = new mongoose.Schema({
  productName:String,
  productPrice: String,
  vendorName    : String,
  vendorLocation: String,
  vendorPhone:String,
  measuringUnits:String,
  code:String,
  createdAt   : {
    type      : Date,
    default   : Date.now()
  },
  updatedAt   :  {
    type      : Date,
    default   : Date.now()
  },
  productCategory:String,
});
module.exports = mongoose.model('products', productsSchema);