const { instance } = require('../config/razorpay');
const Course = require('../models/Course');
const User = require('../models/Users');
const mailSender = require('../utils/mailSender');
const { courseEnrollmentEmail } = require('../mail/templates/courseEnrollmentEmail');
const { default : mongoose } = require('mongoose');

const capturePayment = async(req,res) => {

    try {
        //fetch data
        const { courseId } = req.body;
        const userId = req.user.id;

        //validation 
        if( !courseId ) {
            return res.status(402).json({
                success : false ,
                message : "Course Id is not valid !!!"
            });
        }

        const course = await Course.findById(courseId);

        //course not found
        if(!course) {
            return res.status(402).json({
                success : false ,
                message : "Course not found !!!"
            });
        }

        //Student is paying for same course 
        const uid = new mongoose.Schema.Types.ObjectId(userId);

        if(course.studentsEnrolled.includes(uid)) {
            return res.status(403).json({
                success : false ,
                message : "Student is allready Enrolled !!!"
            });
        }

        //order create
        const amount = course.price;
        const currency = "INR";

        const options = {
            amount : amount * 100 ,
            currency ,
            receipt : Math.random(Date.now()).toString() ,
            notes : {
                courseId ,
                userId ,
            }
        }

        try {

            const paymentResponse = await instance.order.create(options);
            console.log(paymentResponse);
            
            return res.status(200).json({
                success : true ,
                courseName : course.courseName ,
                courseDescription : course.courseDiscription ,
                thumbnail : course.thumbnail ,
                orderID : paymentResponse.id ,
                currency : paymentResponse.currency ,
                amount : paymentResponse.amount ,
                message : "Payment Successfully completed !!!"
            })

        } catch (error) {
            console.log("Error while paying to razorpay :- ",error.message);
            return res.status(400).json({
                success : false ,
                message : "Payment Gateway Error !!!",
            })
        }

    } catch (error) {
        console.log("Error while capturing payment :- ",error.message)
        return res.status(500).json({
            success : false ,
            message : 'Internal Server Error !!!'
        })
    }
}

//verify Signature of Razorpay and Server 

const verifySignature = async(req,res) => {
    try {
        
    } catch (error) {
        console.log("Error while capturing payment :- ",error.message)
        return res.status(500).json({
            success : false ,
            message : 'Internal Server Error !!!'
        })
    }
}

module.exports = { capturePayment , verifySignature };