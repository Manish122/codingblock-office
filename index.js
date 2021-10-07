const express = require('express');
require('dotenv').config();
const app = express();
const path = require('path');
require('dotenv').config();
// const nodemailer = require("nodemailer");
const {google} = require("googleapis")

//   let testAccount = await nodemailer.createTestAccount();
const CLIENT_ID = '914292725101-d6rcc2vcdkubke9dqdm51mkfj3tm5cha.apps.googleusercontent.com'
const CLEINT_SECRET = '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'
const REDIRECT_URI = 'https://developers.google.com/oauthplayground'
const REFRESH_TOKEN = '1//04QFC02rZ_5iVCgYIARAAGAQSNwF-L9IrsYPerUA5ReYp-K-8mtOzH-InD-My8mOcKh0Ci2ETTQlcgtk2N2Jci8wjXNfoxcyg3Sw'

// const sgMail = require('@sendgrid/mail');
const nodemailer = require("nodemailer");

// sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const port = process.env.PORT || 3000;

// console.log(dotenv.parsed);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({
    extended: true
}))

const Alert = require('./models/schema.js');


const d = new Date();


app.get('/', (req, res) => {
    res.render('form');
})

app.post('/new', (req, res) => {
    const result = new Alert({
        FirstName:req.body.fname,
        LastName:req.body.lname,
        Gender:req.body.gender,
        Email:req.body.email,
        PhoneNumber:req.body.number,
        Status:req.body.check,
    })
    result.save();
    const mail = req.body.email;
    const check = req.body.check;
    const oAuth2Client = new google.auth.OAuth2(CLIENT_ID,CLEINT_SECRET,REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
  
    async function sendMail() {
        try {
          const accessToken = await oAuth2Client.getAccessToken();
      
          const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              type: 'OAuth2',
              user: 'waliamanish122@gmail.com',
              clientId: CLIENT_ID,
              clientSecret: CLEINT_SECRET,
              refreshToken: REFRESH_TOKEN,
              accessToken: accessToken,
            },
          });
      
          const message = {
            from: 'manish <waliamanish122@gmail.com>',
            to: 'waliamanish521@gmail.com',
            subject: 'Hello from gmail using API',
            text: 'Hello from gmail email using API',
            html: `<h1>You ${check}  Office at This Time ${d.getHours()}:${d.getMinutes()} IST</h1>`,
          };
      
          const result = await transport.sendMail(message);
          return result;
        } catch (error) {
          return error;
        }
      }  

    sendMail()
    .then((result) => console.log('Email sent...', result))
    .catch((error) => console.log(error.message));  
    res.render('enter');
})


app.post('/enter',(req,res)=>{
    res.redirect('/');
})

// app.listen(port, () => {
//     console.log(`Connected To Port  ${port}`);
// })
app.listen(port,()=>{
    console.log("server started at port 4000");
});