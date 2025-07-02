const jwt = require('jsonwebtoken');
require('dotenv').config();
// const User = require('../models/Users');

// auth
const auth = async(req,res,next) => {
    try {
        const token = req.body?.token || req.cookie?.token || req.headers['Authorization'].replace('Bearer ','');

        if(!token) {
            return res.status(401).json({
                success : false ,
                message : "Token Not found !!!"
            });
        }

        try {
            const decode = jwt.verify(token,process.env.JWT_SECRET_TOKEN)
            console.log("Decode value :- ",decode);
            req.user = decode;
        } catch (error) {
            res.status(401).json({
                success: false ,
                message : "Invalid Token !!!"
            })
        }
        next();
    } catch (error) {
        res.status(500).json({
            success : false,
            message : "Interal Server Error from auth Middleware !!!" 
        });
    }
}
// isStudent

const isStudent = async(req,res,next) => {
    try {

        if(req.user.accountType != 'Student') {
            return res.status(401).json({
                success : false,
                message : "This is protected route for student only !!!"
            });
        }
        next();
    } catch (error) {
        res.status(500).josn({
            success : false,
            message : "User role cannot be verified , please try again later !!!"
        })
    }
}
// isInstructor

const isInstructor = async(req,res,next) => {
    try {

        if(req.user.accountType != 'Instructor') {
            return res.status(401).json({
                success : false,
                message : "This is protected route for Instructor only !!!"
            });
        }
        next();
    } catch (error) {
        res.status(500).josn({
            success : false,
            message : "User role cannot be verified , please try again later !!!"
        })
    }
}
// isAdmin

const isAdmin = async(req,res,next) => {
    try {

        if(req.user.accountType != 'Admin') {
            return res.status(401).json({
                success : false,
                message : "This is protected route for Admin only !!!"
            });
        }
        next();
    } catch (error) {
        res.status(500).josn({
            success : false,
            message : "User role cannot be verified , please try again later !!!"
        })
    }
}

exports.module = {auth , isStudent ,isInstructor ,isAdmin }