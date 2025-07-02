const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT;

const dbConnect = require('./config/dbConnect');
dbConnect();

// console.log("Nandan :- ",dbConnect);

app.listen(PORT,() => {
    console.log("Server is running on port :- ",PORT);
})
