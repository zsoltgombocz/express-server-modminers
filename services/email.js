const nodemailer = require('nodemailer')
const Email = require('email-templates')
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
    process.env.OAuth_C_ID,
    process.env.OAuth_C_S,
    "https://developers.google.com/oauthplayground" // Redirect URL
);

oauth2Client.setCredentials({
    refresh_token: process.env.R_TOKEN
});
const accessToken = oauth2Client.getAccessToken()

function send(to, template, payload = null) {
    if(!process.env.GMAIL_ADDR || !process.env.GMAIL_PASS) 
    return ({message: "Környezeti változók nincsenek beállítva."})
    
    const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        type: "OAuth2",
        user: process.env.GMAIL_ADDR, 
        clientId: process.env.OAuth_C_ID,
        clientSecret: process.env.OAuth_C_S,
        refreshToken: process.env.R_TOKEN,
        accessToken: accessToken
   },
    tls: {
        rejectUnauthorized: false
    }
    });

    const email = new Email({
        views: { root:'./services/templates', options: { extension: 'ejs' } },
        message: {
          from: process.env.GMAIL_ADDR,	
        },
        preview: true,
        send: true,
        transport: transporter
        //transport: {
          //jsonTransport: true
        //}
        
    });

    email.send({
    template: template,
    message: {
        to: to
    },
    locals: payload
    })
    .then(console.log("Email elküldve!"))
    .catch(console.error);
}

module.exports.send = send;

