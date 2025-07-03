const mongoose = require("mongoose");
require("dotenv").config();

const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : true ,
        trim : true ,
    },
    lastName : {
        type : String ,
        required : true ,
        trim : true ,
    },
    email : {
        type : String ,
        required : true ,
        trim : true ,
    },
    contact_number : {
        type : String ,
        required : true ,
        trim : true ,
    },
    password : {
        type : String,
        required : true ,
        trim : true ,
    },
    accountType : {
        type : String,
        enum : ["Student","Admin","Instructor"],
        required : true ,
    },
    active : {
        type : Boolean,
        default : true ,
    },
    additionalDetails : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "Profile"
    },
    courses : [
        {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "Course"
        }
    ],
    image : {
        type : String ,
        required : true ,
    },
    courseProgress : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "CourseProgress"
        },
    ],
    token : {
        type : String,
    },
    resetPasswordExpires : {
        type : Date,
    }

});

module.exports = mongoose.model('User',userSchema);
