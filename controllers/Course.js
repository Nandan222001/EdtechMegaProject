const Course = require('../models/Course');
const Tag = require('../models/Tags');
const User = require('../models/Users');
const uploadImageToCloudinary  = require('../utils/imageUploader');

const createCourse = async(req,res) => {
    try {

        //fetch data
        const { courseName , courseDescription , whatYouWillLearn , price , tag } =req.body;
        const thumbnail = req.files.thumbnail;

        //validation
        if(!courseName || !courseDescription || !whatYouWillLearn || !price || !tag || !thumbnail) {
            return res.status(400).json({
                success : false ,
                message : "All fields are mandatory !!!"
            });
        }

        //instructor
        // const userId = req.user.id;
        // const instructorDetails = await User.findById(userId);
        // if(!instructorDetails) {
        //     return res.status(404).json({
        //         success : false ,
        //         message : "Instructor Not Found !!!"
        //     });
        // }

        const tagDetails = await Tag.findById(tag);
        if(!tagDetails) {
            return res.status(404).json({
                success : false ,
                message : "Tag Details Not Found !!!"
            });
        }

        //upload image to cloudinary
        const thumbnailImage = await uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME,null,60);
        if(!thumbnailImage) {
            return res.status(500).json({
                success : false ,
                message : "Error While Uploading Image !!!"
            });
        }

        //create course
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            whatYouWillLearn,
            price,
            thumbnail : thumbnailImage.secure_url,
            instructor : req.user.id,
            tag : tagDetails._id
        });

        //add this coursee to the user schema
        await User.findByIdAndUpdate({_id : req.user.id},
            {
                $push : {
                    courses : newCourse._id,
                }
            },
            { new : true }
        );

        // update tag Schema 
        // await Tag.findByIdAndUpdate({
        //     _id : tagDetails._id
        // })

        //return response
        return res.status(200).json({
            success : true ,
            data : newCourse ,
            message : "Course Created Succesfully !!!"
        })
        
    } catch (error) {
        console.log("Error While Adding Course",error.message);
        return res.status(500).json({
            success : false ,
            message : "Internal Server Error",
        })
    }
}

const getAllCourses = async(req,res) => {
    try {

        const allCourses = await Course.find({},{instructor : true ,
            courseName : true ,
            price : true ,
            thumbnail : true ,
            ratingAndReviews : true ,
            studentsEnrolled : true ,
            whatYouWillLearn : true ,
        }.populate('instructor').exec());

        return res.status(200).json({
            success : true ,
            data : allCourses,
            message : "Fetched Succesfully "
        })

    } catch(error) {
        console.log("Error While Fetching Course",error.message);
        return res.status(500).json({
            success : false ,
            message : "Internal Server Error While Fetching Course",
        })
    }
}

const getCourseDetails = async(req,res) => {
    try {
        
        const {courseId} = req.body;
        const courseDetails = await Course.find({_id : courseId})
                                .populate(
                                    {
                                        path : "instructor",
                                        populete : {
                                            path : "additionalDetails",
                                        },
                                    },
                                )
                                .populate("ratingAndReview")
                                .populate("category")
                                .populate({
                                    path : "CourseContent",
                                    populate : {
                                        path : "subSection"
                                    },
                                })
                                .exec();
        
        if(!courseDetails) {
            return res.status(400).json({
                success : false ,
                message : `Could not find course with course id :- ${courseId}`,
            });
        }

        return res.status(200).json({
            success : true ,
            data : courseDetails ,
            message : "Course fetched succesfully !!!"
        })

    } catch (error) {
        console.log("Error While Fetching Course",error.message);
        return res.status(500).json({
            success : false ,
            message : "Internal Server Error While Fetching Course",
        })
    }
}

module.exports = {createCourse , getAllCourses , getCourseDetails}