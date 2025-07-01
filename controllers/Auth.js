const User = require('../models/Users');
const OTP = require('../models/OTP');
const otpGenerator = require('otp-generator');
const bcrypt = require('bcrypt');
const Profile = require('../models/Profile');

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

    if(checkEmailExist) {
        return res.status(403).json({
            success : false,
            message : "User Allready Exist !!!"
        });
    }

    if(password !== confirmPassword) {
        return res.status(403).json({
            success : false,
            message : "Password And Confirm Password is not equal !!!"
        });
    }

    const recentOtp = await otp.findOne({email}).sort({creaatedAt:-1}).limit(1);

    if(recentOtp.length == 0) {
        return res.status(400).json({
            success : false ,
            message : "Otp Not found !!!",
        });
    } else if(recentOtp.otp !== otp){
        return res.status(400).json({
            success : false ,
            message : "Invalid Otp !!!"
        });
    }

    const hashedPassword = await bcrypt.hash(password,10);

    const profileDetails = await Profile.create({
        gender : null,
        dateOfBirth : null ,
        about : null ,
        contactNumber : null ,
    });

    const user = await User.create({
        firstName,
        lastName,
        email,
        contactNumber ,
        password : hashedPassword ,
        accountType ,
        additionalDetails : profileDetails._id,
        image : `https://api.dicebear.com/9.x/initials/svg/seed=${firstName} ${lastName}`
    });

    res.status(200).json({
        success : true ,
        data : user ,
        message : "User Created Succesfully !!!"
    })
}
//signUp

exports.module = {sentOtp , signUp };