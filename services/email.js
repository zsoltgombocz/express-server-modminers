const nodemailer = require('nodemailer')
const Email = require('email-templates')
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
let accessToken;

try {
    const oauth2Client = new OAuth2(
        process.env.OAuth_C_ID,
        process.env.OAuth_C_S,
        "https://developers.google.com/oauthplayground" // Redirect URL
    );
    oauth2Client.setCredentials({
        refresh_token: process.env.R_TOKEN
    });
    accessToken = oauth2Client.getAccessToken()
    .then(res => {})
    .catch(err => {
        console.log("[Hiba]: Nem sikerült elérni az OAuth2 szervereit! Error: " + err.message)
        process.exit(0);    
    })

} catch (error) {
    console.log(error)
}

async function send(to, template, payload = null) {
    if(!process.env.GMAIL_ADDR || !process.env.OAuth_C_ID || !process.env.OAuth_C_S || !process.env.R_TOKEN) {
        return console.log("[HIBA] Környezeti változók nincsnek beállítva!")
    }
    try {
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
    }catch(err){
        console.log(err)
    }

    const email = new Email({
        views: { root:'./services/templates', options: { extension: 'ejs' } },
        message: {
          from: process.env.GMAIL_ADDR,	
        },
        preview: false,
        send: true,
        transport: transporter
        //transport: {
          //jsonTransport: true
        //}
        
    });

    try {
        await email.send({
            template: template,
            message: {
                to: to
            },
            locals: payload
            });
      } catch (error) {
        throw new Error(error.message);
      }

    /*email.send({
    template: template,
    message: {
        to: to
    },
    locals: payload
    })
    .then((val) => { console.log(val) })
    .catch((err) => { return Promise.reject(new Error(err.message)); });*/
}

module.exports.send = send;

