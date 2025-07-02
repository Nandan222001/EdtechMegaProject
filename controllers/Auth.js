const User = require('../models/Users');
const OTP = require('../models/OTP');
const otpGenerator = require('otp-generator');
const bcrypt = require('bcrypt');
const Profile = require('../models/Profile');
const jwt = require('jsonwebtoken');
const mailSender = require('../utils/mailSender');

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
    try {
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

        const recentOtp = await otp.findOne({email}).sort({createdAt:-1}).limit(1);

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
    } catch (error) {
        res.status(500).json({
            success : false ,
            message : "Internal Server Error !!!"
        })
    }
}
//signUp function

const login = async(req,res) => {
    
    try {
        const {email,password} = req.body;
        if(!email || !password) {
            return res.status(403).json({
                success : false ,
                message : "All fields are required !!!"
            });
        }

        const userExist = await User.findOne({email}).populate('additionalDetails');

        if(!userExist) {
            return res.status(400).json({
                success : false ,
                message : "User Doesnt Exist Kindly Sign Up first !!!"
            });
        }

        if(await bcrypt.compare(password,userExist.password)) {

            const payload = {
                id : userExist._id,
                email : userExist.email,
                role : userExist.accountType
            }

            const token = jwt.sign(payload , process.env.JWT_SECRET_TOKEN,{
                expiresIn : "2h",
            });

            userExist.token = token;
            userExist.password = undefined;

            const options = {
                expires : new Date(Date.now() * 3 * 24 * 60 * 60 * 100),
                httpOnly : true
            };

            res.cookie("token",token,options).status(200).json({
                success : true,
                token,
                userExist,
                message : "Logged in Succesfully !!!"
            });

        } else {
            return res.status(401).json({
                success : false , 
                message : "Incorrect Password !!!",
            });
        }

    } catch (error) {
        res.status(500).json({
            success : false ,
            message : "Internal Server Error !!!"
        })
    }
}
//login

const changePassword = async(req,res) => {

    try{
        const {oldPassword,newPassword,confirmPassword} = req.body;
        const userDetails = await User.findById(req.user.id)

        if(!oldPassword || !newPassword || !confirmPassword) {
            return res.status(403).json({
                success : false,
                message : "All fields are required !!!"
            });
        }

        if(newPassword !== confirmPassword) {
            return res.status(403).json({
                success : false , 
                message : "New Password and Confirm Password are not same !!!",
            })
        }

        if(await bcrypt.compare(oldPassword,userDetails.password)) {

            const encryptedPassword = await bcrypt.hash(newPassword, 10)
            const updatedUserData = await User.findByIdAndUpdate(userDetails._id,
                            { password: encryptedPassword },
                            { new: true }
                        );

            try {
                const emailResponse = await mailSender(
                    updatedUserData.email,
                    "Password Change for EDTECH",
                    `<h1>Password Changes for your email :- ${updatedUserData.email}`
                );
                console.log("Email response :- ",emailResponse);

            } catch (error) {
                return res.status(500).json({
                    success : false ,
                    message : "Internal Server Error while sending password updation mail !!!"
                })
            }

            res.status(200).json({
                success : true ,
                data : data,
                message : "Password Changed Succesfully !!!",
            })

        } else {
            return res.status(402).json({
                success : false ,
                message : "Old Password Is Incorrect !!!"
            })
        }
    } catch (error) {
        return res.status(500).json({
            success : false ,
            message : "Internal Sever Error !!!"
        });
    } 
}
//changePassword

exports.module = {sentOtp , signUp , login , changePassword};