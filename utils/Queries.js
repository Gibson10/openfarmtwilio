const Product = require('../models/product')
const Orders=require('../models/orders');
const MpesaTransation=require('../models/mpesaTransactions')
const User= require('../models/users')


function findProducts(){
    return new Promise(function (resolve,reject){
        Product.find({} ,function(err, result){
            if(err){
            reject(err);
            }
            resolve (result);
          });
    });

      
}


function findProductByCode(code){
  return new Promise(function (resolve,reject){
      Product.find({code:code} ,function(err, result){
          if(err){
          reject(err);
          }
          resolve (result);
        });
  });
}

function findOrders(){
  return new Promise(function (resolve,reject){
    Orders.find({} ,function(err, result){
        if(err){
        reject(err);
        }
        resolve (result);
      });
});
}

function addOrders(data,name,type){
  return new Promise(function (resolve,reject){
data.map( (res) =>{
     const dataitem= {
       productName:res.productName,
        productPrice: res.productPrice,
        vendorName: res.vendorName,
        vendorLocation: res.vendorLocation,
        customerName:name,
        transactionType:type,
        vendorPhone: res.vendorPhone,}

        Orders.create(dataitem, function(err, result){
          if(err){
            reject(err);  
          }
          resolve (result);
         })

    })
});
}


function addMpesaTransaction(data){
  return new Promise(function (resolve,reject){
    MpesaTransation.create(data ,function(err, result){
        if(err){
        reject(err);
        }
        resolve (result);
      });
});
}

function getMpesaTransaction(id){
  return new Promise(function (resolve,reject){
    MpesaTransation.find({CheckoutRequestID:id} ,function(err, result){
        if(err){
        reject(err);
        }
        resolve (result);
      });
});
}


function findUserByToken(token){
  return new Promise(function (resolve,reject){
    User.findOne({access_token:token} ,function(err, result){
        if(err){
        reject(err);
        }
        resolve (result);
      });
});
}

// Function to create random user id
function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (var i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
  }
  
module.exports={
    findProducts,
    makeid,
    findProductByCode,
    findOrders,
    addOrders,
    addMpesaTransaction,
    getMpesaTransaction,
    findUserByToken
}