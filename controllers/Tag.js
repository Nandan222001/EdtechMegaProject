const Tag = require('../models/Tags');

const createTag = async(req,res) => {
    try {

        const {name , description } = req.body;

        if(!name || !description) {
            return res.status(400).json({
                success : false ,
                message : "All Fields are required !!!"
            });
        }

        const tagDetails = await Tag.create({
            name : name ,
            description : description ,
        })

        return res.status(200).json({
            success : false ,
            data : tagDetails ,
            message : "Tag Created Successfully !!!"
        });

    } catch (error) {
        console.log("Error Encountered :- ",error.message);
        return res.status(500).json({
            success : false ,
            message : "Internal Server Error !!!",
        })
    }
}

const showAllTags = async(req,res) => {
    try {

        const getAllTags = await Tag.find({},{
            name : true , description : true
        });
        
        return res.status(200).json({
            success : true ,
            data : getAllTags ,
            message : "All Records are fetched succesfully !!!"
        });

    } catch (error) {
        console.log('Error :- ',error.message);
        return res.status(500).json({
            success : false ,
            message : "Internal Server Error !!!"
        })
    }
}
module.exports = {createTag,showAllTags};