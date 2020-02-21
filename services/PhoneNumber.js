



function MpesaNumberFormat(number){
   const phoneNumber= number.slice(1);
   const CountryCode='254';

   const mpesaNumber= CountryCode.concat(phoneNumber);

   return mpesaNumber;

}

function TwilioNumberFormat(number){
    const prefix="whatsapp:+"
    const phoneNumber=number;

    const twilioNumber=prefix.concat(phoneNumber);
    return twilioNumber;
}

function twilioToNormalNumberFormat(number){
    const twilioNumber=number;
    const normalNumber=twilioNumber.substring(9, 22);

    return normalNumber;

}

module.exports={
    MpesaNumberFormat,
    TwilioNumberFormat,
    twilioToNormalNumberFormat
}