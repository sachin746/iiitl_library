const sgmail=require('@sendgrid/mail');
const User=require('../models/User');

sgmail.setApiKey(process.env.SENDGRID_API_KEY);

const bookissue = async (issuedbook) => {
    const mailOptions = {
        to:issuedbook.rollno+'@iiitl.ac.in',
        from:"LIT2019027@iiitl.ac.in",
        subject: "Book issued in library",
        html: `Hello,<br>You have issued a book with name ${issuedbook.book} on the date ${issuedbook.created.toDateString()}.Return the book by ${issuedbook.return.toDateString()} to library`
    }
    sgmail.send(mailOptions).then(()=>{
        console.log('Email sent');
    }).catch((err)=>{
        console.error(err.errors);
    })
}

module.exports = bookissue;