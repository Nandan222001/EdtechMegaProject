const Section = require('../models/Section');
const SubSection = require('../models/SubSection');
const { imageUploader } = require('../utils/imageUploader');

const createSubSection = async(req,res) => {
    try {
        // fetch data
        const { title , timeDuration , discription , sectionId } = req.body;

        const videoFile  = req.files.videFile;
        //validation
        if(!title || !timeDuration || !discription || !sectionId) {
            return res.status(400).json({
                success : false ,
                message : "All fields are required "
            });
        }

        if(!videoUrl ) {
            return res.status(400).json({
                success : false ,
                message : "Video File is required "
            });
        }

        const uploadVideToCloudinary = await imageUploader(videoFile,process.env.FOLDER_NAME,null,60);

        const newSubSection = await SubSection.create({
            title ,
            timeDuration ,
            discription ,
            videoUrl : uploadVideToCloudinary.secure_url,
        },{new:true});

        const updateSection = await Section.findByIdAndUpdate({_id : sectionId},{
            $push : {
                SubSection : newSubSection._id ,
            }
        },{new:true});

        // HW : LOG updated section here , after adding populate query
        const result = await updateSection.populate({
            path : "SubSection"
        });

        //return response
        return res.status(200).json({
            success : true ,
            data : result ,
            message : "Sub-Section Created Succesfully !!!"
        });

    } catch (error) {
        console.log("Error While Creating Sub-Section :- ",error.message);
        return res.status(500).json({
            success : false ,
            message : "Internal Server Error",
        })
    }
}

const updateSection = async(req,res) => {
    
    try {
        //fetch data
        const {title , timeDuration , discription ,subSectionId} = req.body;

        //validation
        if(!title || !timeDuration || !discription || !subSectionId) {
            return res.status(403).json({
                success : false ,
                message : "All fields are required !!!"
            });
        }

        const videoFile  = req.files.videFile;

        if(videoFile) {
            return res.status(403).json({
                success : false ,
                message : "All fields are required !!!"
            });
        }

        const uploadVideToCloudinary = await imageUploader(videoFile,process.env.FOLDER_NAME,null,60);

        const newSubSection = await SubSection.create({
            title ,
            timeDuration ,
            discription ,
            videoUrl : uploadVideToCloudinary.secure_url,
        },{new:true});

        return res.status(200).json({
            success : true ,
            data : newSubSection,
            message : "Sub Section Updated Succesfully !!!"
        })
    } catch (error) {
        console.error("Errror while updating SubSection :- ",error.message);
        return res.status(500).json({
            success : false ,
            message : "Internal Server Error !!!"
        })
    }
}

const deleteSubsection = async(req,res) => {

    const subSectionId = req.params;

    if(!subSectionId) {
        return res.status(403).json({
            success : false ,
            message : "Sub Section Id is Required !!!"
        });
    }

    await SubSection.findByIdAndDelete({_id : subSectionId});

    return res.status(200).json({
            success : true ,
            message : "Sub Section Deleted Succesfully !!!"
        });
}

exports.module = { createSubSection , updateSection , deleteSubsection};