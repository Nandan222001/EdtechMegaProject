const nodemailer = require('nodemailer');
require('dotenv').config();

const sendMailer = async(email,title,body) => {

    try {

        const transporter = nodemailer.createTransport({
            host : process.env.HOST_NAME,
            auth : {
                user : process.env.USER_EMAIL,
                pass : process.env.USER_PASS, 
            }
        });

        const info = transporter.sendMail({
            from : "NK TECh",
            to : `${email}`,
            subject : `${title}`,
            html : `${body}`,  
        });

        console.log("Email Sended :- ",info);
        return info;
        
    } catch (error) {
        console.error("Error While Sending Mail !!!");
        console.log(error.message);
    }
}

exports.module = sendMailer;