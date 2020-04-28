const nodemailer = require('nodemailer')
const hbs = require('nodemailer-express-handlebars')
function send(to, subject, variant = null, payload = null) {
    if(!process.env.GMAIL_ADDR || !process.env.GMAIL_PASS) 
    return ({message: "Környezeti változók nincsenek beállítva."})
    
    const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: process.env.GMAIL_ADDR,
        pass: process.env.GMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
    });

    transporter.use('compile', hbs({
        viewEngine: {
            extName: '.hbs',
            partialsDir: 'services/email_templates'
        },
        viewPath: 'services/email_templates',
        extName: '.hbs'    
    }));

    let mailOptions = {
        from: process.env.GMAIL_ADDR,
        to: to,
        subject: subject,
        template: 'verifyUser',
        context: {}
    };
    
    transporter.sendMail(mailOptions, function (err, info) {
        if(err)
          console.log(err);
        else
        console.log(info);
     });
}

module.exports.send = send;

