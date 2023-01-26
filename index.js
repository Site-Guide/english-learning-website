const express = require('express');
const appwrite = require("appwrite");
const app = express();
require('dotenv').config();

app.get('/', (req, res) => {
    const client = new appwrite.Client();
    client
    .setEndpoint('http://appwrite.engexpert.in/v1')
    .setProject('63ca393fc7b7f28ab286');
    const account = new appwrite.Account(client);
   
    const userId = req.query.userId;
    const secret = req.query.secret;
  
    account.updateVerification(userId, secret)
      .then((response) => {
        console.log(response);
        try {
            res.redirect('appwrite-callback-63ca393fc7b7f28ab286://success')
        } catch (error) {
            
        }
      })
      .catch((error) => {
        console.log(error); // Failure
        res.send('Error updating verification');
      });
  
});

app.post('/razorpay-webhook', (req, res) => {
  const client = new appwrite.Client();
  client
  .setEndpoint('http://appwrite.engexpert.in/v1')
  .setProject('63ca393fc7b7f28ab286').setKey(
    process.env.APPWRITE_API_KEY
  );
  console.log(req.body);
  const databases = new appwrite.Databases(client);
  const promise = databases.createDocument('main', 'razorpay_purchases', 'unique()', {
    'value': JSON.stringify(req.body),
  });

  promise.then(function (response) {
      console.log(response); // Success
  }, function (error) {
      console.log(error); // Failure
  });
  
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});



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