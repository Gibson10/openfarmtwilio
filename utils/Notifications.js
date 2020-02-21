const {sendMessage}= require('./twilio')



function vendorNotification(vendorNumber,twilioNumber, data){


console.log(vendorNumber);
console.log(twilioNumber);
console.log("DATA2",data)

    const body=`Hello ${data.vendorName}, you have received an order of ${data.productName}  at ${data.productPrice} from ${data.customerName}. Please contact ${data.customerName} at ${data.customerNumber} for delivery`;

    sendMessage( vendorNumber,twilioNumber, body)


}

module.exports={
    vendorNotification, 
}