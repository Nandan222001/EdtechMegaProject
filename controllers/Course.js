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
            })
        }

        //instructor



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