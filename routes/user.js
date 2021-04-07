const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

const User = require('../models/User');
const emailverifi=require('../emailing/email');
const isactive = require('../emailing/isactive');
const { ensureAuthenticated } = require('../config/auth');

router.get("/login", (req, res) => {
    res.render("login")
})

router.get("/register", (req, res) => {
    res.render("register")
})

router.get('/isactive',ensureAuthenticated,(req,res)=>{
    res.render('isactive')
})

router.post("/emailverify",ensureAuthenticated,async(req,res)=>{
    await User.findOne({email:req.user.email})
    .then(async user=>{
        if(user.code==req.body.code){
            await User.findOneAndUpdate({email:user.email},{$set:{
                'active':'true'
            }}).then(
                user=>{
                    res.redirect('/dashboard');
                }
            )
        }else{
            req.flash('error_msg','wrong Otp')
            res.redirect('isactive')
        }
    })
})

router.post('/register', (req, res) => {
    const { name, email, password, password2, mobile_no } = req.body;
    let errors = [];

    //Check required fields
    if (!name || !email || !password || !password2 || !mobile_no) {
        errors.push({ msg: 'Please fill in all fields' })
    }

    //check iiitl student only
    if (email.split("@").slice(1) != 'iiitl.ac.in') {
        errors.push({
            msg: 'Only iiit lucknow student are allowed'
        })
    }
    //password match
    if (password != password2) {
        errors.push({ msg: 'Password do not match' });
    }

    //check pass length
    if (password.length < 8) {
        errors.push({ msg: 'Password should be at least 8 character' })
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            name, email, password, password2, mobile_no
        })
    } else {
        //Validation done
        User.findOne({ email: email.toLowerCase() }).then(user => {
            if (user) {
                //user exist
                errors.push({ msg: 'email is already registered' })
                res.render('register', {
                    errors,
                    name, email, password, password2, mobile_no
                })
            } else {
                const rand=Math.floor(Math.random()*1000000);
                const newUser = new User({
                    name,
                    email:email.toLowerCase(),
                    password,
                    mobile_no,
                    rand
                })
                //hash password
                bcrypt.genSalt(10,(err,salt)=>{
                    bcrypt.hash(newUser.password,salt,(err,hash)=>{
                        if (err) throw err;
                            //set password to hash
                            newUser.password = hash;
                            newUser.save()
                            .then(user => {
                                req.flash('success_msg','you are now registed and can login and verify email')
                                res.redirect('login');
                            })
                            .catch(err => console.log(err));
                    })

                })

            }
        })
    }
})



router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect:'/dashboard',
        failureRedirect:"/user/login",
        failureFlash:true,
    })(req,res,next);
})

router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success_msg','You are log out')
    res.redirect('/user/login')
})

module.exports = router;