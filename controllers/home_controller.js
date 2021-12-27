const BASE_URL = "http://localhost:8000"
const Token = require("../models/Usertoken");
const DoctorToken = require("../models/Doctortoken");
const User = require('../models/user')
const Doctor = require('../models/doctor')
const sendEmail = require("../features/sendEmail");
const crypto = require("crypto");
const Joi = require("joi");
const Blogs = require("../models/blogs");
const Doctor =require("../models/doctor");

module.exports.home =function(req,res){
    return res.render('home',{
        title:"MediCare"
    }); 
}
module.exports.homeP =function(req,res){
    return res.render('home-page',{
        title:"MediCare",
        layout:'layoutN'
    }); 
}
module.exports.findDoc =function(req,res){
    Doctor.find({},function(err,docs){
        return res.render('findDoctor',{
            title:"MediCare|Find-Doctors",
            layout:'layout',
            docs:docs
        });
    }); 
}
module.exports.findDocS =function(req,res){
    Doctor.find({$or:[ {'name':req.body.docName}, {'address.city':req.body.City},{'specialization':req.body.dept} ]},function(err,docs){
        return res.render('findDoctor',{
            title:"MediCare|Find-Doctors",
            layout:'layout',
            docs:docs
        });
    }); 
}

module.exports.forgotPass=function(req,res){
    return res.render('forgotPass',{
        title:"MediCare|Forgot",
        layout:'layout'
    }); 
}


module.exports.resetPass =async (req, res) => {
    try {
        const schema = Joi.object({ email: Joi.string().email().required() });
        const { error } = schema.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const user = await User.findOne({ email: req.body.email });
        const doctor = await Doctor.findOne({ email: req.body.email });
        if (!user && !doctor){
            const msg ="User with given email doesn't exist" 
            res.render('PasswordReset',{title:"Status", message:msg})
            //return res.status(400).send("user with given email doesn't exist");
        }

        let token=''
        let doctortoken=''
        if(user){
            token = await Token.findOne({ userId: user._id });
            if (!token) {
                token = await new Token({
                    userId: user._id,
                    token: crypto.randomBytes(32).toString("hex"),
                }).save();
            }
        }
        else if(doctor){
            doctortoken = await DoctorToken.findOne({ dcotorId: doctor._id });
            if (!doctortoken) {
                doctortoken = await new DoctorToken({
                    doctorId: doctor._id,
                    token: crypto.randomBytes(32).toString("hex"),
                }).save();
            }
        }
        let link=''
        if(user){
            link = `${BASE_URL}/password-reset/${user._id}/${token.token}`;
            await sendEmail(user.email, "Password reset", link);
        }
        else{
            link = `${BASE_URL}/password-reset/${doctor._id}/${doctortoken.token}`;
            await sendEmail(doctor.email, "Password reset", link);
        }
        
        const msg ="password reset link sent to your email account" 
        res.render('PasswordReset',{title:"Status", message:msg})
        //res.send("password reset link sent to your email account");
    } catch (error) {
        const msg ="An error occured" 
        //res.send("An error occured");
        res.render('PasswordReset',{title:"Status", message:msg})
        console.log(error);
    }
};


module.exports.resettingPass =async (req, res) => {
    const userId = req.params.userId;
    const tokenId = req.params.token;
    const token = await Token.findOne({ userId: userId, token:tokenId});
    const doctortoken = await DoctorToken.findOne({ doctorId: userId, token:tokenId});
    if(!token && !doctortoken){
        res.send("There is no such Page");
    }
    res.render('changingPass',{
        title:"MediCare|Reset Password",
        layout:'layout',
        userId:userId,
        token:tokenId
    });
}


module.exports.resettedPass =async (req, res) => {
    try {
        const schema = Joi.object({ password: Joi.string().required() });
        const { error } = schema.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const user = await User.findOne({_id:req.params.userId});
        const doctor = await Doctor.findOne({_id:req.params.userId});
        if (!user && !doctor){
            const msg ="invalid link or expired" 
            res.render('PasswordReset',{title:"Status", message:msg})
            //return res.status(400).send("invalid link or expired")
        } 
        let token=''
        let doctortoken=''
        if(user){
                token = await Token.findOne({
                userId: req.params.userId,
                token: req.params.token,
            });
        }
        else{
                doctortoken = await DoctorToken.findOne({
                doctorrId: req.params.userId,
                token: req.params.token,
            });
        }
        if (!token && !doctortoken){
            const msg ="invalid link or expired" 
            res.render('Password-Reset',{title:"Status", message:msg})
            //return res.status(400).send("invalid link or expired")
        }
        if(user){
            user.password = req.body.password;
            await user.save();
            await token.delete();
        }
        else{
            doctor.password = req.body.password;
            await doctor.save();
            await doctortoken.delete();
        }

        
        const msg ="Password reset sucessfully." 
        res.render('PasswordReset',{title:"Status", message:msg})
        //res.send("password reset sucessfully.");
    } catch (error) {
        const msg ="An error occured" 
        res.render('PasswordReset',{title:"Status", message:msg})
        res.send("An error occured");
        console.log(error);
    }
}




module.exports.blogs =function(req,res){
    Blogs.find({}).populate('uploadBy').exec(function(err,blogs){
    return res.render('blogs',{
        title:"MediCare|Blogs",
        layout:'layout',
        blogs:blogs
    }); 
});
}

module.exports.aptSuccess=function(req,res){
    return res.render('rateUs',{
        title:"MediCare|Forgot",
        layout:'layout'
    }); 
}


//module.exports.action =function(req,res){}