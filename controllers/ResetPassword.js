const User = require('../models/Users');
const mailSender = require('../utils/mailSender');

const resetPasswordToken = async(req,res) => {
    try {
        const email = req.body.mail;
        const checkUser = await User.findOne({email});
        
        if(!checkUser) {
            return res.staus(402).json({
                success : false,
                message : "Your Email is not Registered !!!"
            });
        }

        const token = crypto.randomUUID();

        const updatedDetails = await User.findOneAndUpdate({email:email},{
            token : token,
            resetPasswordExpires : Date.now() +5*60*1000,
        },{new : true});

        const url = `http://localhost:3000/update-password/${token}`;

        await mailSender(email,"Password Reset Link",`Password Reset Link :- ${token}`);

        return res.status(200).json({
            success : true ,
            message : "Email sent succesfully. Please check email and change Password !!!"
        });
        
    } catch (error) {
        re.status(500).json({
            success : false ,
            message : "Internal Server Error At ResetPassword !!!"
        })
    }
}