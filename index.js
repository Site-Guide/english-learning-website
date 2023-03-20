const express = require('express');
const appwrite = require("node-appwrite");
const crypto = require('crypto');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

require('dotenv').config();

const client = new appwrite.Client();
client
  .setEndpoint('http://appwrite.engexpert.in/v1')
  .setProject('63ca393fc7b7f28ab286');

const account = new appwrite.Account(client);


app.get('/', (req, res) => {


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
  const requestedBody = JSON.stringify(req.body)
  const receivedSignature = req.headers['x-razorpay-signature']

  const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET).update(requestedBody).digest('hex',);



  if (receivedSignature === expectedSignature) {
    client.setKey(
      process.env.APPWRITE_API_KEY
    );
    const databases = new appwrite.Databases(client);
    const promise = databases.createDocument('main', 'razorpay_purchases', 'unique()', {
      'amount': req.body.payload.payment.entity.amount / 100,
      'email': req.body.payload.payment.entity.email,
      // 'phone': req.body.payload.payment.entity.contact,
      // 'status': req.body.payload.payment.entity.status,
      'paymentId': req.body.payload.payment.entity.id,
    });
    promise.then(function (response) {
      res.status(200).send('Webhook received');
    }, function (error) {
      console.log(error); // Failure
    });

  } else {
    console.log('Invalid signature');
  }

});





app.route('/reset-password')
  .get((req, res) => {
    const userId = req.query.userId;
    const secret = req.query.secret;

    // if valid, show the reset password form
    res.send('<div style="display: flex; justify-content: center; align-items: center; height: 80vh; overflow: hidden;">' +
      '<form action="/reset-password" method="post" style=" padding: 2rem; width:100%; font-size:3rem">' +
      '<label for="password" style="font-weight: 500;"><span style="color: #f2c702; font-size: 2rem; font-weight: 600;">EngExpert</span><br /><p style="margin-bottom: 2rem; margin-top: -1rem; font-weight: 500; color: gray;">Reset Password</p>New Password:</label>' +
      '<input type="password" id="password" name="password" style=" font-size:3rem; margin-right: 100%; width: 100%; border: none; border-bottom: 3px solid #f2c702; outline: none; height: 6rem;"><br><br>' +
      '<label for="cpassword" style="font-weight: 500; ">Confirm Password:</label>' +
      '<input type="password" id="cpassword" name="cpassword" style=" font-size:3rem; margin-right: 100%; width: 100%; border: none; border-bottom: 3px solid #f2c702; outline: none; height: 6rem;"><br><br>' +
      '<input type="hidden" name="userId" value="' + userId + '">' +
      '<input type="hidden" name="secret" value="' + secret + '">' +
      '<input type="submit" value="Reset Password" style=" font-size:3rem; width:100%; margin-top: 1rem; padding: 0.5rem; height: 5rem; color: #fff; background-color: #f2c702; border: none; outline: none; cursor: pointer; border-radius: 8px;">' +
      '</form></div>');

  })
  .post((req, res) => {
    var password = req.body.password;
    var cpassword = req.body.cpassword;
    var userId = req.body.userId;
    var secret = req.body.secret;
    if (password !== cpassword) {
      res.send("Passwords do not match");
    } else {
      const promise = account.updateRecovery(userId, secret, password, cpassword);

      promise.then(function (response) {
        res.send('Your password has been reset successfully.');
      }, function (error) {
        res.send("Error in updating password " + error.message + `${userId}: ${secret}`);
      });
    }
  });


app.listen(3000, () => {
  console.log('Server listening on port 3000');
});



// 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