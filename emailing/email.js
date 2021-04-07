const sgmail=require('@sendgrid/mail');
const User=require('../models/User');

sgmail.setApiKey(process.env.SENDGRID_API_KEY);


const emailverifi=async(user)=>{
    if(user.active===false){
        const randomno=Math.floor(Math.random()*1000000);
        await User.findOneAndUpdate({email:user.email},{$set:{'code':randomno}});
        const mailOptions = {
            to:user.email,
            from:"lit2019027@iiitl.ac.in",
            subject:"Library OTP",
            html: "Dear Student,<br>This is the OTP to verify your email.<br>OTP ---- "+randomno
        }
        sgmail.send(mailOptions).then(()=>{
            console.log('Email sent');
        }).catch((err)=>{
            console.error(err.errors);
        })
        return 1;
    }
    else if(user.active===true){
        return 2;
    }
}

module.exports=emailverifi;