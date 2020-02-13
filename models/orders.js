var mongoose = require('mongoose');

 var ordersSchema = new mongoose.Schema({
  customerName:String,
  customerNumber:String,
  customerLocation:String,
  productPrice: String,
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
module.exports = mongoose.model('orders', ordersSchema);