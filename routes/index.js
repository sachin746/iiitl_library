const express=require('express');
const router=express.Router();
const {ensureAuthenticated} = require('../config/auth');
const isactive = require('../emailing/isactive');
const quotes=require('../qoutes/quotes');


router.get("/",(req,res)=>{
    let random=Math.floor(Math.random()*1640);
    let arrayquotes=[];
    for(var i=0;i<3;i++){
        arrayquotes.push(quotes[random+i])
    }
    res.render('home',{arrayquotes});
})

router.get("/dashboard",ensureAuthenticated,isactive,(req,res)=>{
    res.render('dashboard',{user:req.user});
})

module.exports=router;