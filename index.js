const express = require('express');
const appwrite = require("appwrite");
const app = express();

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

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});





