const cloudinary = require('cloudinary').v2();

const uploadImageToCloudinary = async(file,folder,innerHeight,quality) => {

    try {
        const options = {folder};

        if(height) {
            options.height = height;
        }

        if(quality) {
            options.quality = quality;
        }

        return await cloudinary.uploader.upload(file.tempFilePath , options);
        
    } catch (error) {
        console.log("Error While Image Upload !!!");
        return res.status(500).json({
            success : false ,
            message : "Internal Server Error !!!"
        });
    }
}

module.exports = uploadImageToCloudinary;