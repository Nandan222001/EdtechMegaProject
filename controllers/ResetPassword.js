const User = require('../models/Users');
const mailSender = require('../utils/mailSender');
const bcrypt = require('bcrypt');

const resetPasswordToken = async(req,res) => {
    try {
        const email = req.body.mail;
        const checkUser = await User.findOne({email});
        
        if(!checkUser) {
            return res.staus(402).json({
                success : false,
                message : "Your Email is not Registered !!!"
            });
        }

        const token = crypto.randomUUID();

        const updatedDetails = await User.findOneAndUpdate({email:email},{
            token : token,
            resetPasswordExpires : Date.now() +5*60*1000,
        },{new : true});

        const url = `http://localhost:3000/update-password/${token}`;

        await mailSender(email,"Password Reset Link",`Password Reset Link :- ${token}`);

        return res.status(200).json({
            success : true ,
            message : "Email sent succesfully. Please check email and change Password !!!"
        });
        
    } catch (error) {
        re.status(500).json({
            success : false ,
            message : "Internal Server Error At Generating Token !!!"
        })
    }
}

const resetPassword = async(req,res) => {
    try {

        const {password , confirmPassword , token } = req.body;
        if(password != confirmPassword) {
            return res.status(403).json({
                success : false , 
                message : "Password and Confirm Password Doesn't Match !!!"
            });
        }

        const userDetails = await User.findOne({token : token });

        if(!userDetails) {
            return res.status(403).json({
                success : false , 
                message : "Invalid Token !!!"
            });
        }

        if(userDetails.resetPasswordExpires < Date.now()) {
            return res.status(403).json({
                success : false , 
                message : "Token is expired pleases try again to reset your password !!!"
            });
        }

        const hashedPassword = await bcrypt.hash(password , 10);

        await User.findOneAndUpdate({token:token},{
            password : hashedPassword
        },{new : true});

        res.status(200).json({
            success : true ,
            message : "Password Changed Succesfully !!!"
        })

    } catch (error) {
        res.status(500).json({
            success : false,
            message : "Internal Server Error While Reseting Password !!!"
        })
    }
}


module.exports = {resetPasswordToken , resetPassword }