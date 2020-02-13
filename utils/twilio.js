require('dotenv').config()
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);


 function sendMessage(to, from, body)  {
    return new Promise((resolve, reject) => {
      client.messages
        .create({
          to,
          from,
          body
        })
        .then(message => {
          resolve(message.sid);
        })
        .catch(error => {
          reject(error);
        });
    });
  };

  module.exports={
    sendMessage, 
  }