const Product= require('../../models/product');
const Transaction= require('../../models/transactions');
const Order=require('../../models/orders');
const  Vendor= require('../../models/vendors');
const {findProducts,makeid,findOrders}=require('../../utils/Queries');



exports.addProducts=(req, res)=>{
  var randomUserId = makeid();

 const data = {
    productName:req.body.productName,
    productCategory:req.body.productCategory,
    productPrice: req.body.productPrice,
    vendorName  : req.body.vendorName,
    vendorLocation: req.body.vendorLocation,
    vendorPhone:req.body.vendorPhone,
    code:randomUserId.slice(0,3).toUpperCase(), 
 }

  console.log();
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
    const data= req.body;

    Order.create(data, function(err, result){
     if(err){
        return res.send("There was an error");
     }

     
     return res.send(result)
     

    })
    
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

