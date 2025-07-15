const Category = require('../models/Category');

const createCategory = async(req,res) => {
    try {

        const {name , description } = req.body;

        if(!name || !description) {
            return res.status(400).json({
                success : false ,
                message : "All Fields are required !!!"
            });
        }

        const categoryDetails = await Category.create({
            name : name ,
            description : description ,
        })

        return res.status(200).json({
            success : false ,
            data : categoryDetails ,
            message : "Category Created Successfully !!!"
        });

    } catch (error) {
        console.log("Error Encountered :- ",error.message);
        return res.status(500).json({
            success : false ,
            message : "Internal Server Error !!!",
        })
    }
}

const showAllCategory = async(req,res) => {
    try {

        const getAllCategory = await Category.find({},{
            name : true , description : true
        });
        
        return res.status(200).json({
            success : true ,
            data : getAllCategory ,
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

// category page details 
const categoryPageDetails = async(req,res) => {
    try {
        //get catigoryId
        const {categoryId} = req.body;

        const selectedCategory = await Category.findById(categoryId)
                                        .populate('courses')
                                        .exec();

        if(!selectedCategory) {
            return res.status(200).json({
                success : true ,
                message : "Data not found !!!"
            });
        }

        const defferentCategories = await Category.find({
            _id : {$ne : categoryId }
        })
        .populate("courses")
        .exec();

        return res.status(200).json({
            success : true ,
            data : {
                selectedCategory ,
                defferentCategories ,
            }
        });


    } catch (error) {
        console.log('Error :- ',error.message);
        return res.status(500).json({
            success : false ,
            message : "Internal Server Error !!!"
        })
    }
}

module.exports = {createCategory,showAllCategory,categoryPageDetails};