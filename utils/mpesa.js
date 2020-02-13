// import { Mpesa } from "mpesa-api";
require('dotenv').config()
const Mpesa = require("mpesa-api").Mpesa;

const credentials = {
    client_key: process.env.MPESA_CONSUMER_KEY,
    client_secret: process.env.MPESA_CONSUMER_SECRET,
    initiator_password: process.env.MPESA_SECURITY_CREDENTIAL,
    certificatepath: null
};
const environment = "sandbox";


const mpesa = new Mpesa(credentials, environment);




function MpesaTransaction(phone){  
  return new Promise(function (resolve,reject){
  mpesa
  .lipaNaMpesaOnline({
    BusinessShortCode: 174379,
    Amount: 1,
    PartyA: phone,
    PartyB: 174379,
    PhoneNumber: phone,
    CallBackURL: "https://138e197f.ngrok.io/mpesapayment",
    AccountReference: "Payment",
    passKey: "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919",
    TransactionType: "CustomerPayBillOnline" /* OPTIONAL */,
    TransactionDesc: "Payment of products" /* OPTIONAL */
  })
  .then(response => {
    //Do something with the response
    //eg
    console.log("MPESA RESPONSE",response);
    resolve (response);
  })
  .catch(error => {
    //Do something with the error;
    //eg
    console.error(error);
    reject (error);
  });

  })


}



module.exports={
    MpesaTransaction,
}
