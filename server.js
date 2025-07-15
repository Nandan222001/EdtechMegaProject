const express = require('express');
const app = express();

const userRoutes = require('./routes/user');
const profileRoutes = require('./routes/Profile');
const paymentsRoutes = require('./routes/Payments');
const courseRoutes = require('./routes/Course');

const cookieParser = require('cookie-parser');
const cors = require('cors');
const {cloudinaryConnect} = require('./config/cloudinary');
const fileUpload = require('express-fileupload');

require('dotenv').config();
const PORT = process.env.PORT;

const dbConnect = require('./config/dbConnect');
dbConnect();

app.use(express.json());
app.use(cookieParser());
// console.log("Nandan :- ",dbConnect);

app.use(
    cors({
        origin : "http://localhost:3000",
        credentials : true ,
    })
)

app.use(fileUpload({
    useTempFiles : true ,
    tempFileDir : "/tmp",
}));

cloudinaryConnect();

app.use('/api/v1/auth',userRoutes)
app.use('/api/v1/profile',profileRoutes)
app.use('/api/v1/payment',paymentsRoutes)
app.use('/api/v1/course',courseRoutes)


app.get('/',(req,res)=> {
    res.send('<h1>Server is Running on port 3000</h1>');
});

app.listen(PORT,() => {
    console.log("Server is running on port :- ",PORT);
})
