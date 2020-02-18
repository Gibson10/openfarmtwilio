require('dotenv').config()
const dialogflow = require("dialogflow");
const credentials= require('../credentials.json');


const sessionClient = new dialogflow.SessionsClient({
    credentials: credentials
  });

  const projectId=process.env.DIALOGFLOW_PROJECT_ID;
  
   function runQuery(query,number){
    return new Promise(async (resolve, reject) => {
      try {
        // A unique identifier for the given session
        //const sessionId = uuid.v4();
        const sessionId = number;
        // Create a new session
  
        const sessionPath = sessionClient.sessionPath(projectId, sessionId);
  
        // The text query request.
        const request = {
          session: sessionPath,
          queryInput: {
            text: {
              // The query to send to the dialogflow agent
              text: query,
              // The language used by the client (en-US)
              languageCode: "en-US"
            }
          },
          queryParams: {
            payload: {
              fields: {
                twilioNumber: {
                  stringValue: number,
                  kind: "stringValue"
                },
              
              }
            }
          }
        };
  
        // Send request and log result
        const responses = await sessionClient.detectIntent(request);
  
        const result = responses[0].queryResult;
  
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  };

  module.exports={
    runQuery,
  }