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
        const userId = req.user.id;
        const instructorDetails = await User.findById(userId);
        if(!instructorDetails) {
            return res.status(404).json({
                success : false ,
                message : "Instructor Not Found !!!"
            });
        }

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
        const courseDetails = await Course.create({
            courseName,
            courseDescription,
            whatYouWillLearn,
            price,
            thumbnail : thumbnailImage.secure_url,
            instructor : instructorDetails._id,
            tag : tagDetails._id
        });

        //return response
        return res.status(200).json({
            success : true ,
            data : courseDetails ,
            message : "Course Added Succesfully !!!"
        })
        
    } catch (error) {
        console.log("Error While Adding Course",error.message);
        return res.status(500).json({
            success : false ,
            message : "Internal Server Error",
        })
    }
}

module.exports = {createCourse}