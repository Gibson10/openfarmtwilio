'use strict';
/**
 * Product Model
 **/
var mongoose = require('mongoose');

 var vendorsSchema = new mongoose.Schema({
  vendorName    : String,
  vendorLocation: String,
  vendorPhone:String,
  createdAt   : {
    type      : Date,
    default   : Date.now()
  },
  updatedAt   :  {
    type      : Date,
    default   : Date.now()
  },
});
module.exports = mongoose.model('vendors', vendorsSchema);

