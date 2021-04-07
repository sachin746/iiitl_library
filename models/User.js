const mongoose=require('mongoose');

const UserSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    mobile_no:{
        type:String,
        required:true
    },
    active:{
        type:Boolean,
        default:false
    },
    code:{
        type:Number,
        required:false
    }

})

const User = mongoose.model('User',UserSchema);
module.exports =User;