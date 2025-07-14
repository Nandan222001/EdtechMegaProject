const RatingAndReview = require('../models/RatingAndReview');
const Course = require('../models/Course');

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
        })
    }
}

//getAverageRatingAndReview
const getAverageRatingAndReview = async(req,res) => {
    try {
        
        //getCourseId
        const {courseId} = req.body.course_id;

        //calculate avg rating

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


exports.module = { createRating , getAverageRatingAndReview }