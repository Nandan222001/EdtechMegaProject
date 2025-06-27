const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true ,
    },
    otp : {
        type : String,
        required : true ,
    },
    createdAt : {
        type : String ,
        required : true,
        default : Date.now(),
        expires : 5 * 60 ,
    }
});

//Send The Email :- 

async function sendVerificationEmail(email,otp) {
    try {
        const mailResponse  = await mailSender(email,"This is from ED-Tech",otp)
        console.log("Email Sent Succesfully :- ",mailResponse);
    } catch (error) {
        console.log("Error While Sending Verification Mail :- ",error.message);
    }
}

otpSchema.pre('save', async function(next) {
    sendVerificationEmail(this.email,this.otp);
})

module.exports = mongoose.model('OTP',otpSchema);