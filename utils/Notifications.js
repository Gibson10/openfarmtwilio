const {sendMessage}= require('./twilio')



function vendorNotification(vendorNumber,twilioNumber, data,){

    const body=`Hello ${data.vendorName}, you have received an order of ${data.productName}  at ${data.productPrice} from ${data.customerName}. Please contact ${data.customerName} at ${data.phoneNumber} for delivery`;

    sendMessage( vendorNumber,twilioNumber, body)


}

function vendorTextNotification(vendorNumber,twilioNumber, data){

    const body=`Hello ${data.vendorName}, you have received an order of ${data.productName}  at ${data.productPrice} from ${data.customerName}. Please contact ${data.customerName} at ${data.phoneNumber} for delivery`;

    sendMessage( vendorNumber,twilioNumber, body)
}

module.exports={
    vendorNotification, 
    vendorTextNotification,
}


