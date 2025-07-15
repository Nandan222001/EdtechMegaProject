const RatingAndReview = require('../models/RatingAndReview');
const Course = require('../models/Course');
const { default: mongoose } = require('mongoose');

//createRatingReview

const createRating = async(req,res) => {
    try {

        //get user id
        const userId = req.user.id;

        //fetch data from req body
        const {rating , review , courseId} = req.body;

        //check if user is enrolled or not
        const courseDetails = await Course.findOne({
            _id: courseId,
            studentsEnrolled: { $elemMatch: { $eq: userId } }
        }) 

        // check if user already revieved the course 
        const allreadyReviewed = await RatingAndReview.findOne({
            user : userId ,
            course : courseId ,
        });

        if(allreadyReviewed) {
            return res.status(404).json({
                success : false ,
                message : "Student allready reviewed the course !!!"
            });
        }

        if(!courseDetails) {
            return res.status(404).json({
                success : false ,
                message : "Student is not enrolled in this course !!!"
            });
        }
        // create the rating and review
        const newRatingAndReview = await RatingAndReview.create({
            user : userId ,
            rating : rating ,
            review : review ,
            course : courseId ,
        });
        
        // update course with this rating and review
        const updatedCourse = await Course.findByIdAndUpdate({_id : courseId},{
            $push : {
                ratingAndReviews : newRatingAndReview._id ,
            }
        },{new:true});

        // return response 
        return res.status(200).json({
            success : true ,
            data : updatedCourse,
            message : "Rating and Review added succesfully !!!"
        });

    } catch (error) {
        console.log("Error While Adding Rating and Review");
        return res.status(500).json({
            success : false ,
            message : "Internal Server Error !!!" 
        });
    }
}

//getAverageRatingAndReview
const getAverageRatingAndReview = async(req,res) => {
    try {
        
        //getCourseId
        const {courseId} = req.body.course_id;

        //calculate avg rating
        const result = await RatingAndReview.aggregate([
            {
                $match : {
                    course : new mongoose.Types.ObjectId(courseId),
                },
            },
            {
                $group : {
                    _id : null ,
                    averageRating : { $avg : "$rating"}
                }
            }
        ]);

        if(result.length > 0 ) {
            return res.status(200).json({
                success : true ,
                averageRating : result[0].averageRating 
            })
        }

        //if no rating found 
        return res.status(200).json({
            success : true ,
            message : "Average Rating is zero , no ratings given till now !!!",
            averageRating : 0 ,
        })
        
        //return rating

    } catch (error) {
        console.error("Error encountered :- ",error.message);
        return res.status(500).json({
            success : false ,
            message : "Internal Server Error"
        });
    }
}

//getAllRatingAndReview
const getAllRatingAndReview = async(req,res) => {
    try {

        // const { courseId } = req.body;

        const allReviews = await RatingAndReview.find({})
                    .sort({rating : "desc"})
                    .populate({
                        $path : "user" ,
                        select : "firstName lastName email image"
                    })
                    .populate({
                        $path : "course",
                        select : "courseName"
                    })
                    .exec();

        return res.status(200).json({
            success : true ,
            data : allReviews ,
            message : "All Reviews fetched succesfully !!!"
        })
    } catch (error) {
        console.error("Error encountered getting all rating and reviews :- ",error.message);
        return res.status(500).json({
            success : false ,
            message : "Internal Server Error"
        });
    }
}

exports.module = { createRating , getAverageRatingAndReview ,getAllRatingAndReview }