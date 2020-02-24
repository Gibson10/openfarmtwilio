require('dotenv').config()
const {runQuery}= require("../../utils/dialogueflow");
const {sendMessage}= require("../../utils/twilio");
const {MpesaTransaction} =require('../../utils/mpesa')
const  {flutterWavePayment}=require('../../utils/flutterwave')
const {findProducts, findProductByCode,findOrders,addOrders,addMpesaTransaction,getMpesaTransaction,findOrdersbyNumber}=require('../../utils/Queries');
const {MpesaNumberFormat,TwilioNumberFormat,twilioToNormalNumberFormat} = require('../../services/PhoneNumber') 
const {vendorNotification,vendorTextNotification}= require('../../utils/Notifications');
const {UrlShortener} = require('../../services/urlshortener');



exports.sendTwilio = async (req, res)=>{
  const { Body, To, From } = req.body;
  // Here we're sending the received message to Dialogflow so that it can be identified against an Intent.
  runQuery(Body, From,To)
    .then((result) => {
      
      console.log(result.fulfillmentText);
      console.log(From);
      console.log(To)
      // We send the fulfilment text received back to our user via Twilio
      sendMessage(From, To, result.fulfillmentText)
        .then(res => { 
      
          console.log(res)

        })
        .catch(error => {
          // console.error("error  on this is", error);
      
        });
    })
    .catch(error => {
      // console.error("error is ", error);
    
    });
  return res.status(200).send("SUCCESS");
}



exports.sendDialogueFlow=async(req, res)=>{
  console.log(req.body);

switch(req.body.queryResult.intent.displayName) {
  
  case "Start":
    var number=req.body.originalDetectIntentRequest.payload.customerNumber;
    var phoneNumber1=number.substring(9, 22);
    var Product= await findProducts();
    var Orders= await findOrdersbyNumber(phoneNumber1);

   
    if(Orders){
      res.setHeader("Content-Type","application/json");
      res.send(JSON.stringify({
        fulfillmentText: `Hello ${Orders.customerName} Welcome back to OpenFarm,We hope you enjoyed your last order of ${Orders.productName}. Here is the list of products we are offering today: \n`+  Product.map((res,index)=>`*${index+1}.* ${res.productName}\nPrice: ${res.productPrice}\nLocation: ${res.vendorLocation}\nShortCode: *${res.code}*`).join("\n\n") +'\n' +`Please respond with the Shortcode of the product you are interested in, example *${"XYZ"}*`,
  
        sessionEntityTypes:[
        {
          name:"projects/openfarm-idpnex/agent/sessions/openfarm-idpnex/entityTypes/productAbbreviation",
          entities:Product.map(res =>({
           value:res.code,
           synonyms:[res.code,res.productName]
          })),
          entityOverrideMode:"ENTITY_OVERRIDE_MODE_OVERRIDE",
        }
      ]
  
    }
    ));

    }
    
    else{
  
       res.setHeader("Content-Type","application/json");
       res.send(JSON.stringify({
        fulfillmentText: `Hello Welcome to OpenFarm, here is the list of products we are offering now: \n`+  Product.map((res,index)=>`*${index+1}.* ${res.productName}\nPrice: ${res.productPrice}\nLocation: ${res.vendorLocation}\nShortCode: *${res.code}*`).join("\n\n") +'\n' +`Please respond with the Shortcode of the product you are interested in, example *${"XYZ"}*`,

      sessionEntityTypes:[
      {
        name:"projects/openfarm-idpnex/agent/sessions/openfarm-idpnex/entityTypes/productAbbreviation",
        entities:Product.map(res =>({
         value:res.code,
         synonyms:[res.code,res.productName]
        })),
        entityOverrideMode:"ENTITY_OVERRIDE_MODE_OVERRIDE",
      }
    ]

  }
  ));
  
    break;
    }

  case "Start - custom":
         var code=req.body.queryResult.queryText;
         var ProductbyCode = await findProductByCode(code);
     if(ProductbyCode.length>0){
         res.setHeader("Content-Type","application/json");
         res.send({fulfillmentText:`Great Choice! You have selected `+ ProductbyCode.map((res)=>`${res.productName}\n Do you want to continue to purchase ${res.productName} at ${res.productPrice}`) + `\n *${"A"}*:yes \n *${"B"}*:no`      
      })
    }else{
         res.setHeader("Content-Type","application/json");
         res.send({fulfillmentText:`Sorry, we could not find the Product, Please enter the *
        ${"ShorCode"}* again.Please confirm before resending`
              
      })

    }
    
    break;

    

    case 'Start - confirmation':
          var confirmation=req.body.queryResult.queryText;
          var productAbbreviation=req.body.queryResult.parameters.productAbbreviation;

       if(confirmation==="A"){
          var ProductPrice= await findProductByCode(productAbbreviation);
          res.setHeader("Content-Type","application/json");
          res.send({fulfillmentText:`Thank you for making an order for `+ ProductPrice.map((res)=>` ${res.productName}\n Please reply with *${"first"}* and *${"last"}*  name to continue making an order`)})
       } else{

          res.setHeader("Content-Type","application/json");
          res.send({fulfillmentText:`Thank you for your interest, please restart the process by typing 'hi' or 'hello' or 'start' `})
       }


    break;

    case 'Start - confirmation - customerName':
      var number1=req.body.originalDetectIntentRequest.payload.customerNumber;
      var twilio=req.body.originalDetectIntentRequest.payload.twilioNumber
      var phoneNumber=twilioToNormalNumberFormat(number1);
      var name=req.body.queryResult.queryText;
      var productAbbreviation3=req.body.queryResult.parameters.productAbbreviation;
      var ProductDetails= await findProductByCode(productAbbreviation3);
      var createOrder=await addOrders(ProductDetails,name,"mpesa",phoneNumber)
      console.log("ORDER",createOrder);

      res.setHeader("Content-Type","application/json");
      res.send( JSON.stringify({fulfillmentText:`Thank you very much ${name} for making an order of ` + ProductDetails.map((res)=> `${res.productName}  at  ${res.productPrice}.We will be processing your order and making a delivery soon. Please reply with *${"mpesa"}* to continue making an mpesa payment and checkout`)}))

      // vendorNotification("whatsapp:+254741785762",twilio,createOrder)
      // vendorTextNotification("+254741785762","+16193206948",createOrder)


    break; 
     
    case 'Start - confirmation - paymentMethod':   
          var payment=req.body.queryResult.queryText;
      if(payment.toLowerCase()==='mpesa'){
          res.setHeader("Content-Type","application/json");
          res.send({fulfillmentText: `Please enter your mpesa number to continue.Example *${"07xxxxxxxx"}* `,
        });
      }
         res.setHeader("Content-Type","application/json");
         res.send(JSON.stringify(
          { 
          fulfillmentText: `Please enter First and Second name. Example(John Doe)`
          }
        ));
           
    break;


    case 'Start - confirmation - mpesa - phoneNumber':
         var twilioPhoneNumber=req.body.originalDetectIntentRequest.payload.twilioNumber;
         var phonenumber=req.body.queryResult.queryText;
         var mpesaPhoneNumber= MpesaNumberFormat(phonenumber);
         var productAbbreviation4=req.body.queryResult.parameters.productAbbreviation;
         var ProductDetails2= await findProductByCode(productAbbreviation3);
         var person=req.body.queryResult.parameters.customerName
         console.log("JINA",person);
  
         res.setHeader("Content-Type","application/json");
         res.send(JSON.stringify(
           {fulfillmentText:`Your number has been approved, you will be prompted to enter your M-pesa Pin  shortly on the phone with the number ${phonenumber}\n.Once you enter the number wait for the payment to be fully processed.` }))

         var MpesaTransactionResponse= await flutterWavePayment(phonenumber); 
         console.log(MpesaTransactionResponse);

         var data={
            vendorName:ProductDetails2.vendorName,
            productName:ProductDetails2.productName,
            productPrice:ProductDetails2.productPrice,
            customerName:person.name,
            vendorNumber:ProductDetails2.vendorPhone,
            twilioNumber:twilioPhoneNumber,
            phoneNumber:mpesaPhoneNumber,
            orderRef:MpesaTransactionResponse.data.orderRef,
        }
        const NewMpesaTransaction=await addMpesaTransaction(data)
        console.log(NewMpesaTransaction);

    break;

   

  default:

}
}


// exports.mpesaPayment= async(req, res)=>{

//           const statusResponse=req.body.Body.stkCallback.ResultDesc;
//           const CheckoutRequestID=req.body.Body.stkCallback.CheckoutRequestID
//    if(statusResponse==="The service request is processed successfully."){
//           const mpesaTransaction = await getMpesaTransaction(CheckoutRequestID)
//    if(mpesaTransaction.length>0){
//           const To=process.env.TWILIO_PHONE_NUMBER;
//           const body=`Thank you, your order will be delivered soon`;
//     for(i=0; i<mpesaTransaction.length;i++ ){
//           const From=TwilioNumberFormat(mpesaTransaction[i].phoneNumber)
//           console.log(To)
//           sendMessage(From,To,body)
//     }
//   }
//     } else{
//           const mpesaTransaction = await getMpesaTransaction(CheckoutRequestID)
//     if(mpesaTransaction.length>0){
//           const To=process.env.TWILIO_PHONE_NUMBER;
//           const body=statusResponse;
//      for(i=0; i<mpesaTransaction.length;i++ ){
//           const From="whatsapp:+"+mpesaTransaction[i].phoneNumber
//           console.log(To)
//           sendMessage(From,To,body)
//     }
//   }

// }

// }


exports.flutterWave=async(req,res)=>{
console.log(req.body);
   const statusResponse=req.body.status;
   const orderRef=req.body.orderRef
   if(statusResponse==="successful"){
 console.log(req.body.customer)
          const mpesaTransaction = await getMpesaTransaction(orderRef)
          console.log("TRANSACTION",mpesaTransaction);
   if(mpesaTransaction.length>0){
          const To=process.env.TWILIO_PHONE_NUMBER;
          
    for(i=0; i<mpesaTransaction.length;i++ ){
      const body=`Thank you *${mpesaTransaction[i].customerName}* for your order.It will be delivered soon.For any delayed deliveries please contact *${"0741785762"}*  `;
          const From=TwilioNumberFormat(mpesaTransaction[i].phoneNumber)
          console.log(To)
          sendMessage(From,To,body)
          vendorNotification("whatsapp:+254741785762",twilio,mpesaTransaction[i])
          vendorTextNotification("+254741785762","+16193206948",mpesaTransaction[i])
    }
  }
    } else{
          const mpesaTransaction = await getMpesaTransaction(CheckoutRequestID)
    if(mpesaTransaction.length>0){
          const To=process.env.TWILIO_PHONE_NUMBER;
          const body=statusResponse;
     for(i=0; i<mpesaTransaction.length;i++ ){
          const From="whatsapp:+"+mpesaTransaction[i].phoneNumber
          console.log(To)
          sendMessage(From,To,body)
    }
  }

}

}
