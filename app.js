const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongooose = require('mongoose');
const flash = require('connect-flash');
const session=require('express-session');
const bodyparser=require('body-parser');
const passport = require('passport');
var bodyParser = require("body-parser");
var multer = require("multer");
var fs = require("fs");
const app = express();

//passport config
require('./config/passport')(passport);

//DATABASE
mongooose.connect(process.env.MONGO_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false 
},
function (err, db) {
    if (err) { console.log(err) }
    else {
        console.log("Connected to MongoDB server ...")
    }
});

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//bodyparser
app.use(express.urlencoded({extended:false}));
app.use(bodyparser.json());
app.use(express.static('product_image'));
app.use(express.static('public'));

//express session middleware; 
app.use(session({
    secret:'my mobile no is 626412179',
    resave:true,
    saveUninitialized:true
}))

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//connect flash
app.use(flash());

//Global vars
app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    res.locals.success_msg=req.flash('success_msg');
    res.locals.error_msg=req.flash('error_msg');
    res.locals.error=req.flash('error');
    next()

})

//Routes
app.use("/", require('./routes/index'))
app.use("/user", require('./routes/user'))
app.use("/books",require('./routes/book'));

const PORT = process.env.PORT;
app.listen(PORT,
    console.log(`server started on port ${PORT}`))