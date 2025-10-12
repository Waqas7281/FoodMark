const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    fullName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
    },
    phoneNumber:{
        type:String,
    },
    role:{
        type:String,
        enum:['User','Owner','Rider'],
        required:true,
    },
    resetOtp:{
        type:String,
    },
    isOtpVerified:{
        type:Boolean,
        default:false,
    },
    otpExpiryTime:{
        type:Date,
    }
},{timestamps:true});

const User = mongoose.model('User',userSchema);
module.exports = User; 