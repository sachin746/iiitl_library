const emailverifi = require("./email")

module.exports= isactive=async(req,res,next)=>{
    const respon= await emailverifi(req.user);
    if(respon==1){
        res.render('isactive');
    }
    else if(respon==2){
        next()
    }
}