require('dotenv').config()
const {runQuery}= require("../../utils/dialogueflow");
const {sendMessage}= require("../../utils/twilio");
const {MpesaTransaction} =require('../../utils/mpesa')
const {findProducts, findProductByCode,findOrders,addOrders,addMpesaTransaction,getMpesaTransaction}=require('../../utils/Queries');



exports.sendTwilio = async (req, res)=>{
  const { Body, To, From } = req.body;
  // Here we're sending the received message to Dialogflow so that it can be identified against an Intent.
  runQuery(Body, From)
    .then((result) => {
      
      console.log(result.fulfillmentText);
      console.log(From);
      console.log(To)
      // We send the fulfilment text received back to our user via Twilio
      sendMessage(From, To, result.fulfillmentText)
        .then(res => {  

        })
        .catch(error => {
          console.error("error  on this is", error);
      
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

    const Product= await findProducts()
    res.setHeader("Content-Type","application/json");
    res.send(JSON.stringify({
      fulfillmentText: `Hello Welcome to OpenFarm, here is the list of products we are offering now: \n`+  Product.map((res,index)=>`*${index+1}.* ${res.productName}\nPrice: ${res.productPrice}\nLocation: ${res.vendorLocation}\nShortCode: *${res.code}* `).join("\n\n") +'\n' +`Please respond with the Shortcode of the product you are interested in, example *${"XYZ"}*`,
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

  case "Start - custom":
     const code=req.body.queryResult.queryText;
     const ProductbyCode = await findProductByCode(code);
   
      res.setHeader("Content-Type","application/json");
      res.send({fulfillmentText:`Great Choice! You have selected `+ ProductbyCode.map((res)=>`${res.productName}\n Do you want to continue to purchase ${res.productName} at ${res.productPrice}`) + `\n *${"A"}*:yes \n *${"B"}*:no`
              
      })
    
    break;

    case 'Start - confirmation':
       const confirmation=req.body.queryResult.queryText;
       const productAbbreviation=req.body.queryResult.parameters.productAbbreviation;

       if(confirmation==="A"){
          const ProductPrice= await findProductByCode(productAbbreviation);
          res.setHeader("Content-Type","application/json");
          res.send({fulfillmentText:`Thank you for making an order for `+ ProductPrice.map((res)=>` ${res.productName}\n How would you like to make the payment? Please reply with *${"mpesa"}* to continue making an mpesa payment`)})
       } else{
          res.setHeader("Content-Type","application/json");
          res.send({fulfillmentText:`Thank you for your interest, please restart the process by typing 'hi' or 'hello' or 'start' `})
       }

    break;
     
    case 'Start - confirmation - payment':   
    var payment=req.body.queryResult.queryText;
      if(payment.toLowerCase()==='mpesa'){
          res.setHeader("Content-Type","application/json");
          res.send({fulfillmentText: `Please enter your mpesa number to continue`,
  
        });

      }

        res.setHeader("Content-Type","application/json");
        res.send(JSON.stringify(
          { 
          fulfillmentText: `Please enter First and Second name. Example(John Doe)`
       }
        ));
           
    break;

    case 'Start - confirmation - mpesa - number':

         const phonenumber=req.body.queryResult.queryText;
    
         res.setHeader("Content-Type","application/json");
         res.send(JSON.stringify(
           {fulfillmentText:`Your number has been approved, you will be prompted to enter your M-pesa Pin  shortly on the phone with the number ${phonenumber}` }))

          var MpesaTransactionResponse= await MpesaTransaction(phonenumber); 
          const data={
            phoneNumber:phonenumber,
            CheckoutRequestID:MpesaTransactionResponse.CheckoutRequestID,
          }
          addMpesaTransaction(data)

    break;

    case 'Start - confirmation - payment - username':
      var name=req.body.queryResult.queryText;
      var productAbbreviation3=req.body.queryResult.parameters.productAbbreviation;
      var ProductDetails= await findProductByCode(productAbbreviation3);
      var createOrder=await addOrders(ProductDetails,name,"mpesa")
      console.log("JINA", name)

         res.setHeader("Content-Type","application/json");
         res.send( JSON.stringify({fulfillmentText:`Thank you very much ${name} for making an order of ` + ProductDetails.map((res)=> `${res.productName}  at  ${res.productPrice}.We will be processing your order and making a delivery soon. Please don't hesitate to contact ${res.vendorPhone} for a delayed delivery`)}))
    break;  

  default:

}
}


exports.mpesaPayment= async(req, res)=>{
 const statusResponse=req.body.Body.stkCallback.ResultDesc;
 const CheckoutRequestID=req.body.Body.stkCallback.CheckoutRequestID
 if(statusResponse==="The service request is processed successfully."){
 const mpesaTransaction = await getMpesaTransaction(CheckoutRequestID)
  if(mpesaTransaction.length>0){
    const To="whatsapp:+14155238886";
    const body=`Please enter your *${"First"}* and *${"Last"}* Name`;

    for(i=0; i<mpesaTransaction.length;i++ ){
      const From="whatsapp:+"+mpesaTransaction[i].phoneNumber
      console.log(To)
      sendMessage(From,To,body)
    }
  }
} else{
  const mpesaTransaction = await getMpesaTransaction(CheckoutRequestID)
  if(mpesaTransaction.length>0){
    const To="whatsapp:+14155238886";
    const body=statusResponse;
    for(i=0; i<mpesaTransaction.length;i++ ){
      const From="whatsapp:+"+mpesaTransaction[i].phoneNumber
      console.log(To)
      sendMessage(From,To,body)
    }
  }

}

}
