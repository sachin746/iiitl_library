const sgmail=require('@sendgrid/mail');
const User=require('../models/User');

sgmail.setApiKey(process.env.SENDGRID_API_KEY);



const returnbook = async (email,bookname) => {
    const mailOptions = {
        to:email,
        from:"lit2019027@iiitl.ac.in",
        subject: "Return Book to library Immedietly",
        html: `Hello,<br>You have not returned the book with name ${bookname} to library.Return the book by today`
    }
    sgmail.send(mailOptions).then(()=>{
        console.log('Email sent');
    }).catch((err)=>{
        console.error(err);
    })
}

module.exports = returnbook;