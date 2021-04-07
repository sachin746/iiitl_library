const sgmail=require('@sendgrid/mail');
const User=require('../models/User');

sgmail.setApiKey(process.env.SENDGRID_API_KEY);

const returnbook = async (issuedbook) => {
    const mailOptions = {
        to:issuedbook.rollno+'@iiitl.ac.in',
        subject: "Book returned to library",
        html: `Hello,<br>You have returned the book with name ${issuedbook.book} to library`
    }
    sgmail.send(mailOptions).then(()=>{
        console.log('Email sent');
    }).catch((err)=>{
        console.error(err);
    })
}

module.exports = returnbook;