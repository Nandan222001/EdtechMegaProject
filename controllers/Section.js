const Section = require('../models/Section');
const Course = require('../models/Course');

const createSection = async(req,res) => {
    try {
        
        //fetch the data
        const {sectionName , courseId } = req.body;

        //validation
        if(!sectionName || !courseId) {
            return res.status(400).json({
                success : false ,
                message : "All fields are required "
            });
        }

        // create section 
        const newSection = await Section.create({sectionName});

        //updateCourse details
        const updateCourse = Course.findByIdAndUpdate({_id : courseId},{
            $push : {
                courseContent : newSection._id ,
            }
        },{new : true});

        //use Populate to replace section / sub-section both in the updateCourse
        await updateCourse.populate({
            path : "courseContent",
            populate : {
                path : "subSection"
            }
        });

        //if course not found
        if(!updateCourse) {
            return res.status(404).json({
                success : false ,
                message : "Course Not Found !!!"
            });
        }

        //return response
        return res.status(200).json({
            success : true ,
            data : updateCourse ,
            message : "Section Created Succesfully !!!"
        });

    } catch (error) {
        console.log("Error While Creating Section :- ",error.message);
        return res.status(500).json({
            success : false ,
            message : "Internal Server Error",
        })
    }
}

const updateSection = async(req,res) => {

    try {
    //fetch data
    const {sectionName , sectionId} = req.body;

    //data validation
    if(!sectionId || !sectionName) {
        return res.status(400).json({
            success : false , 
            message : "All Fields are required !!!"
        });
    }

    //update Data
    const updateSection = await Section.findByIdAndUpdate(sectionId,{
        sectionName },{ new : true });

    // return res
    return res.status(200).json({
        success : true ,
        data : updateSection,
        message : "Section Updated Succesfully" 
    })

    } catch {
        console.log("Internal Server Error While Updating The Section !!!");
        return res.status(500).json({
            success : false ,
            message : "Internal Server Error",
        })
    }
}

const deleteSection = async(req,res) => {

    try {

        const sectionId = req.body.id;
        
        await Section.findByIdAndDelete({_id : sectionId});

        return res.status(200).json({
            success : true ,
            message : "Section Deleted Succesfully !!!"
        });

    } catch (error) {
        console.log("Error While Deleting Section :- ",error.message);
        return res.status(500).json({
            success : false , 
            message : "Internal Server Error !!!"
        })
    }
}

exports.module = { createSection , updateSection , deleteSection }