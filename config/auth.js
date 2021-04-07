const User = require("../models/User")
const isactive = require("../emailing/isactive")

module.exports={
    ensureAuthenticated: function(req,res,next){
        if(req.isAuthenticated()){
            return next()
        }
        req.flash('error_msg','please login first')
        res.redirect('/user/login')
    }
}
