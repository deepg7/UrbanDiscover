const nodemailer=require('nodemailer')

function mailer(to,subject,text){
    
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
    service:"gmail",  
    auth: {
        user: process.env.GMAIL, // generated ethereal user
        pass: process.env.PASSWORD  // generated ethereal password
    },
    tls:{
        rejectUnauthorized:false
    }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from:process.env.EMAIL , // sender address
        to: to, // list of receivers
        subject: subject, // Subject
        html:text
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('mailsent')
    });
}

module.exports=mailer