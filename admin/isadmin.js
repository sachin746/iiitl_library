module.exports= isadmin=async(req,res,next)=>{
    if(req.user.email.toLowerCase()=='sachinbhadur9@gmail.com'){
        next()
    }else{
        req.flash("error_msg","you are not admin please sign in as admin");
        res.redirect('/user/login');
    }
}