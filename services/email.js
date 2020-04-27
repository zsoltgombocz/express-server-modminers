const nodemailer = require('nodemailer')
const html = require('./email_templates')
function send(to, subjct, variant, payload) {
    if(!process.env.GMAIL_ADDR || !process.env.GMAIL_PASS) 
    return res.status(500).json({message: "Környezeti változók nincsenek beállítva."})
    
    let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: provess.env.GMAIL_ADDR,
        pass: process.env.GMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});

let mailOptions = {
    from: process.env.GMAIL_ADDR,
    to: to,
    subject: subject,
    html: '<p>Your html here</p>'// plain text body
};

transporter.sendMail(mailOptions, function (err, info) {
    if(err)
      res.send(err)
    else
      res.send(info);
 });
}
