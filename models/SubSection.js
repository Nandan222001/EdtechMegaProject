const mongoose = require("mongoose");

const subSectionSchema = new mongoose.Schema({
    title : {
        type : String,
    },
    timeDuration : {
        type : String,
    },
    discription : {
        type : String,
    },
    videoUrl : {
        type : String,
    }
});

module.exports = mongoose.model('SubSection',subSectionSchema);