const User = require('../models/Users');
const OTP = require('../models/OTP');
const otpGenerator = require('otp-generator');
const bcrypt = require('bcrypt');

const sentOtp = async(req,res) => {
    
    try {
        // fetch mail from request
        const {email} = req.body;

        const checkUserPresent = await User.findOne({email});

        if(checkUserPresent) {
            return res.status(401).json({
                success : false ,
                message : "User Allready Exist !!!"
            });
        }

        const otp = otpGenerator.generate(6,{
            upperCaseAlphabets : false ,
            lowerCaseAlphabets : false ,
            specialChars : false ,
        });

        const result = await OTP.findOne({otp : result});

        while(result) {

            const otp = otpGenerator.generate(6,{
            upperCaseAlphabets : false ,
            lowerCaseAlphabets : false ,
            specialChars : false ,
        });
        const result = await OTP.findOne({otp : result});
        }

        const otpPayload = {email : email , otp : otp};

        const data = OTP.create(otpPayload);

        res.status(200).json({
            success : true ,
            data: data,
            message : "Otp Generated Succesfully !!!",
        })

    } catch (error) {
        console.error("Error at Auth Controller :- ",error.message);
        return res.status(500).json({
            success : false,
            message : "Internal Server Error !!!",
        });
    }
}

//sendOtp

const signUp = async(req,res) => {

    const {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        accountType,
        contactNumber,
        otp
    } = req.body;

    if(!firstName || !lastName || !email || !password || !confirmPassword || contactNumber || otp ) {
        return res.status(403).json({
            success : false , 
            message : "All fields are required !!!"
        });
    }

    const checkEmailExist = await User.findOne({email});

    if


}
//signUp

exports.module = {sentOtp , signUp };