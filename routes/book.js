const express=require('express');
const router=express.Router();
const fs =require('fs');
const multer = require("multer");
const {ensureAuthenticated} = require('../config/auth');
const isactive = require('../emailing/isactive');
const Book =require('../models/book');
const isadmin = require('../admin/isadmin');
const User = require('../models/User');
const Issued = require('../models/issued');
const { findOne, countDocuments } = require('../models/User');
const book = require('../models/book');
const bookissue= require('../emailing/bookissue');
const returnbook = require('../emailing/returnbook');
const booknotreturn=require('../emailing/booknotreturn');
var path = require('path');

router.use(express.static('public'))


router.use(express.static('product_image'));
let p1image;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'product_image');
  },
  filename: function (req, file, cb) {
    p1image=file.fieldname+"_"+Date.now() +path.extname(file.originalname)
    cb(null, p1image)
  }
})
var product_image = multer({ storage})

router.get("/",async(req,res)=>{
    await Book.find().then(books=>{
        res.render('books',{books:books})
    }).catch(err=>console.log(err));
})

router.post('/',ensureAuthenticated,isactive,isadmin,product_image.single('image'),async(req,res)=>{
    const {title,total,bookno}=req.body;
    const image=p1image;
    const newbook=new Book({
        title,image,total,bookno
    });
    await newbook.save();
    res.redirect('/books')
})

router.get('/add',ensureAuthenticated,isactive,isadmin,(req,res)=>{
    res.render('new');
});

router.get('/admin',ensureAuthenticated,isactive,isadmin,(req,res)=>{
    let random=Math.floor(Math.random()*1640);
    let arrayquotes=[];
    for(var i=0;i<3;i++){
        arrayquotes.push(quotes[random+i])
    }
    res.render('admin',{arrayquotes});
})

router.get('/issued',ensureAuthenticated,isactive,isadmin,async (req,res)=>{
    await Issued.find()
    .then(issueds=>{
        if(!issueds){
            issueds=[];
        }
    res.render('issued',{issueds});
    })
})

router.post('/issued',ensureAuthenticated,isactive,isadmin,async(req,res)=>{
    const {bookno,rollno}=req.body;
    await Book.findOne({bookno})
    .then(async book=>{
        if(!book){
            req.flash("error_msg","Book not found with this book no");
            res.redirect('/books/issued');
            return 0;
        }
        email=rollno+'@iiitl.ac.in';
        await User.findOne({email})
        .then(async user=>{
            if(!user){
                req.flash("error_msg","This roll is not registered please register with your college email");
                res.redirect('/books/issued');
                return 0
            }
            const issuedbook=new Issued({
                rollno,
                book:book.title,
                bookno
            });
            await issuedbook.save()
            await bookissue(issuedbook);
            await Book.findOneAndUpdate({bookno},{$set:{'total':book.total-1}})
            req.flash("succes_msg","Book issued");
            res.redirect('/books/issued')
        })
        .catch(err=>console.log(err));
    })
    .catch(err=>console.log(err));

})

router.get('/issued/view/:id',ensureAuthenticated,isactive,isadmin,async(req,res)=>{
    await Issued.findById({_id:req.params.id})
    .then(async issued=>{
        const email=issued.rollno+'@iiitl.ac.in'
        await User.findOne({email})
        .then(user=>{
            const student={
                name:user.name,
                email:user.email,
                rollno:issued.rollno,
                bookno:issued.bookno,
                book:issued.book,
                created:issued.created,
                return:issued.return,
                id:req.params.id
            }
            res.render('viewdetails',{student})
        })
        .catch(err=>console.log(err));
    })
    .catch(err=>console.log(err));
})

router.post('/issued/delete/:id',ensureAuthenticated,isactive,isadmin,async(req,res)=>{
    await Issued.findByIdAndRemove({_id:req.params.id})
    .then(async issued=>{
       await Book.findOne({bookno:issued.bookno})
       .then(async book=>{
            await Book.findOneAndUpdate({bookno:book.bookno},{$set:{'total':book.total+1}})
            await returnbook(issued);
            req.flash("success_msg","deleted issued book");
            res.redirect('/books/issued')
       }).catch(err=>console.log(err));
    }).catch(err=>console.log(err));
})

router.get("/book",ensureAuthenticated,isactive,isadmin,async(req,res)=>{
    await Book.find().then(books=>{
        res.render('adminbook',{books:books})
    }).catch(err=>console.log(err));
})

router.get('/edit/:id',ensureAuthenticated,isactive,isadmin,async(req,res)=>{
    await Book.findById({_id:req.params.id})
    .then(book=>{
        res.render('editbook',{book})
    }).catch(err=>console.log(err));
})

router.post('/edit/:id',ensureAuthenticated,isactive,isadmin,product_image.single('image'),async(req,res)=>{
    const {title,total,bookno}=req.body;
    image=p1image;
    const newbook=new Book({
        title,image,total,bookno
    });
    await Book.findByIdAndRemove({_id:req.params.id})
    .then(async book=>{
        const imagepath= path.join(__dirname,'../product_image',book.image);
        fs.unlink(imagepath,async (err)=>{
            if(err){
                console.log(err)
            }else{
                await newbook.save();
                req.flash("success_msg",`Book updated by name ${book.title} and no ${book.bookno}`)
                res.redirect('/books/book')
            }
        })
    }).catch(err=>console.log(err));
})
router.post('/delete/:id',ensureAuthenticated,isactive,isadmin,async(req,res)=>{
    await Book.findByIdAndRemove({_id:req.params.id})
    .then(async book=>{
        const imagepath= path.join(__dirname,'../product_image',book.image);
        fs.unlink(imagepath,(err)=>{
            if(err){
                console.log(err)
            }else{
                req.flash("success_msg",`Book removed by name ${book.title} and no ${book.bookno}`)
                res.redirect('/books/book')
            }
        })
    }).catch(err=>console.log(err));
})


router.get('/mail/:email/:bookname/:id',ensureAuthenticated,isactive,isadmin,async(req,res)=>{
    const email=req.params.email;
    const bookname=req.params.bookname;
    const id=req.params.id;
    await booknotreturn(email,bookname);
    req.flash("success_msg","mail sent");
    res.redirect(`/books/issued/view/${id}`);

})

module.exports=router;