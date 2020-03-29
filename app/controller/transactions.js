
require('dotenv').config()
const Product= require('../../models/product');
const multer  = require('multer')
const Transaction= require('../../models/transactions');
const cloudinary = require('cloudinary');
const express = require('express');
const {upload}=require('../../services/imageupload');
const Order=require('../../models/orders');
const WhatsAppOrders=require('../../models/androidorders')
const  Vendor= require('../../models/vendors');
const {findProducts,makeid,findOrders,findAndroidOrders}=require('../../utils/Queries');



cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.COUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.addProducts=(req, res)=>{
  var randomUserId = makeid();

 var filepath = ''; 

    cloudinary.uploader.upload(req.file.path, function(result) {
        console.log(result)
        filepath = result.secure_url;
       console.log(filepath);
   
// console.log("ProductImage",filepath);
 const data = {
    productName:req.body.productName,
    productCategory:req.body.productCategory,
    productPrice: req.body.productPrice,
    vendorName  : req.body.vendorName,
    vendorLocation: req.body.vendorLocation,
    vendorPhone:req.body.vendorPhone,
    productImage:result.secure_url,
    code:randomUserId.slice(0,3).toUpperCase(), 
 }

 
    Product.create(data , function(error, result){
        if (error){
            return res.send({
                message:"there was an error, please try again"})
        }
        return res.send({
            data:result,
            message:'Product has been Added to the List'
             }
            );
    })
});

}


exports.addTransaction=(req, res)=>{

   const data=req.body;
   Transaction.create(data , function(error, result){
    if (error){
        return res.send("there was an error")
    }
    return res.send(result);
})
}

exports.addVendors=(req,res)=>{ 
    const data= req.body
    Vendor.find({vendorPhone:data.vendorPhone,} ,function(err, result){
        if(err){
        return res.send("An error has happened")
        }else if(!result.length>0){
            

            Vendor.create(data , function(error, result){
                if (error){
                    return res.send({
                        message:"there was an error, please try again"})
                }
                return res.send({
                    data:result,
                    message:'Vendor has been Added to the List'
                     }
                    );
            })
        } else{
  
        return res.send({message:"The Vendor has already been added to the list"});
        }
      })

 
}


exports.addOrder=(req,res)=>{
    console.log(req.body)
    const data= req.body.products;

    for(var i=0; i<data.length; i++){

        console.log("GIBSON",data[i])
    Order.create(data, function(err, result){
     if(err){
        return res.send("There was an error");
     }

     
     return res.send(result)
     
    })
    }
   
    
}




exports.getOrders= async(req, res)=>{

    const Orders= await findOrders();
    return res.send(Orders);

   

}


exports.getTransactions=(req, res)=>{

    Transaction.find({} ,function(err, result){
        if(err){
        return res.send("An error has happened")
        }
  
        return res.send(result);
  
      })
    
}


exports.getVendors=(req, res)=>{
    
    Vendor.find({} ,function(err, result){
        if(err){
        return res.send("An error has happened")
        }
  
        return res.send(result);
  
      })
}
exports.getCustomerByPhone=(req, res)=>{
     const phoneNumber=req.body.phone;
    
    Order.find({customerNumber:phoneNumber} ,function(err, result){
        if(err){
        return res.send("An error has happened")
        }

        console.log(result)
        return res.send(result);
  
      })
}


exports.getVendorByPhone= (req, res)=>{
    const phoneNumber=req.body.phone;
   
   Order.find({vendorPhone:phoneNumber} ,function(err, result){
       if(err){
       return res.send("An error has happened")
       }
 
       return res.send(result);
 
     })
}



exports.getProducts=async (req,res)=>{
    
 const Products= await findProducts();
 console.log(Products);

    return res.send(Products);
}


exports.deleteProductById=(req,res)=>{
    const id =req.body.id;
    Product.findByIdAndDelete({_id:id},function(error,result){
        if(error){
            res.send({message:"An error has occured"})
        }
        res.send({message:"Product SuccessFully Deleted"})
    })


}
exports.deleteVendorById=(req,res)=>{
    const id =req.body.id;
    console.log(id);
    Vendor.findByIdAndDelete({_id:id},function(error,result){
        if(error){
            res.send({message:"An error has occured"})
        }
        res.send({message:"Vendor SuccessFully Deleted"})
    })
    
}
exports.getAndroidOrders= async(req,res)=>{
    // WhatsAppOrders.find({}, function(req,res){

    // })
    const Orders= await findAndroidOrders()
    res.send({message:'SuccessFully got orders',data:Orders})

}

exports.addAndroidOrders =(req,res)=>{
    const data= req.body
    console.log(data)
    WhatsAppOrders.create(data, function(err,result){

        if(err){ 
            return res.send("There was an error");
         }else{
    
         
         return res.send(result)}
        
    })
}

// exports.imageUpload=(req, res)=>{

//     upload(req, res, function (err) {
//         if (err instanceof multer.MulterError) {
//             return res.status(500).json(err)
//         } else if (err) {
//             return res.status(500).json(err)
//         }
//      return res.status(200).send(req.file)

//  })
// }