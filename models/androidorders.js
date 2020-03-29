var mongoose = require('mongoose');

 var androidordersSchema = new mongoose.Schema({
  customerName:String,
  customerPhone:String,
  customerLocation:String,
  products:[{
        productPrice: String,
        transactionType   : String,
        vendorName:String,
        vendorLocation: String,
        vendorPhone:String,
        productName:String,
        productQuantity:String,
  }],
  createdAt   : {
    type      : Date,
    default   : Date.now()
  },
  updatedAt   :  {
    type      : Date,
    default   : Date.now()
  },
});
module.exports = mongoose.model('androidorders', androidordersSchema);