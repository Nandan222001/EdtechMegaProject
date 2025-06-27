const mongoose = require("mongoose");
require('dotenv').config();
const url = process.env.DB_URL;

const dbConnect = () => {
        mongoose.connect(url)
        .then(()=> {
            console.log("Database Connected Succesfully !!!");
        }).catch((error) => {
            console.log("Database Connection Failed !!! ");
            console.error(error.message);
            process.exit(1);
        });
}

module.exports = dbConnect;