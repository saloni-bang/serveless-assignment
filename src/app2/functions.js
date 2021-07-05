

module.exports.function5 = async (event, context) => {
    const { loanId } = event.detail;
    const EventBridge = require('aws-sdk').EventBridge;
    const eventBridge = new EventBridge({
       endpoint: 'http://127.0.0.1:4010',
       accessKeyId: "YOURKEY",
       secretAccessKey: "YOURSECRET",
       region: "eu-west-1"
     });

     await eventBridge.putEvents({
         Entries : [{
             Source : "disbursed-loan-triggered",
             DetailType : "disbursed-loan",
             Detail: JSON.stringify({loanId})

         }]
     }).promise();
     return{
         statusCode: 200,
         body:   "Loan Disbursed Triggered"
     }

}
