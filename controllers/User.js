const User = require('../models/Users');
const Profile = require('../models/Profile');

const updateProfile = async(req,res) => {

    try {

        const { dateOfBirth = '' ,about = '' , contactNumber , gender } = req.body;
        const uesrId = req.user?.id;

        if(!contactNumber || !gender || !uesrId) {
            return res.status(403).json({
                success : false ,
                message : "Mandotory Fields are required !!!"
            });
        }
        const user = await User.findById( uesrId );
        
        const profile = await Profile.findById(user.additionalDetails);

        profile.dateOfBirth = dateOfBirth;
        profile.gender = gender ;
        profile.about = about ;
        profile.contactNumber = contactNumber ;
        
        await profile.save();

        return res.status(200).json({
            success : true ,
            data : updateProfile ,
            message : "Profile Updated Succesfully !!!"
        });

    } catch (error) {
        console.error("Error While Updating Profile :- ",error.message);
        return res.status(500).json({
            success : false ,
            message : "Internal Server Error !!!"
        })
    }
}

const deleteAccount = async(req,res) => {
    try {

        const id = req.user.id;

        const userDetails = await User.findById(id);

        if(!userDetails) {
            return res.status(404).json({
                success : false ,
                message : "User Not found !!!"
            });
        }

        await Profile.findByIdAndDelete({_id : userDetails.additionalDetails});

        await User.findByIdAndDelete({id:id});

        return res.status(200).json({
            success : true ,
            message : "User deleted succesfully !!!"
        });

    } catch (error) {
        console.error("Error While Deleting Profile :- ",error.message);
        return res.status(500).json({
            success : false ,
            message : "Internal Server Error !!!"
        })
    }
}

const getAllUserDetails = async(req,res) => {
    try {

        const id = req.user.id ;
        
        if(!id) {
            return res.status(404).json({
                success : false ,
                message : "Id Not found !!!"
            });
        }

        const userDetails = await User.findById(id).populate('additionalDetails').exec();

        return res.status(200).json({
            success : true ,
            data : userDetails ,
            message : "User deleted succesfully !!!"
        })
    } catch (error) {
        console.error("Error While Fetching Profile Details :- ",error.message);
        return res.status(500).json({
            success : false ,
            message : "Internal Server Error !!!"
        })
    }
}
exports.module = { updateProfile , deleteAccount ,getAllUserDetails }