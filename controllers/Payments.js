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
};

//verify Signature of Razorpay and Server 
const verifySignature = async(req,res) => {
    try {
        
        const webhookSecret = "1234567890";
        const signature = req.headers["x-razorpay-signature"];

        const shasum = crypto.createHmac("sha256",webhookSecret);
        shasum.update(JSON.stringify(req.body));
        const digest = shasum.digest("hex");

        if(signature === digest) {
            console.log("Payment is Authorised !!!");
            const {courseId , userId} = req.body.payload.payment.entity.notes;
            try {
                const enrolledCourse = await Course.findOneAndUpdate(
                    {_id : courseId},
                    {$push : {studentsEnrolled : userId}} ,
                    {new : true }
                ); 

                if(!enrolledCourse) {
                    return res.status(500).json({
                        success : false,
                        message : "Course Not Found !!!"
                    });
                }

                console.log("Enrolled Course :- ",enrolledCourse);

                const enrollStudent = await User.findOneAndUpdate(
                    {_id : userId} ,
                    {$push : {courses : courseId }},
                    {new : true }
                );

                console.log("Enroller Student :- ",enrollStudent );
                
                //mail send kro confirmation
                const emailResponse = await mailSender(enrollStudent.email , "Congratulations ","Congratulation Your are onboarded on new course !!!") 
                
                return res.status(200).json({
                    success : true ,
                    message : "Succefuuly Enrolled in the Selected Course !!!"
                })
            } catch (error) {
                console.log("Error while capturing payment :- ",error.message)
                return res.status(500).json({
                    success : false ,
                    message : 'Internal Server Error !!!'
                })
            }
        } else {
            return res.status(400).json({
                success: false ,
                message : "Invalid request !!!"
            })
        }

    } catch (error) {
        console.log("Error while capturing payment :- ",error.message)
        return res.status(500).json({
            success : false ,
            message : 'Internal Server Error !!!'
        })
    }
};

module.exports = { capturePayment , verifySignature };