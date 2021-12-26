const Doctor = require('../models/doctor')
const Blogs = require('../models/blogs');
const Appointment = require('../models/appointment');
const { findById } = require('../models/doctor');

module.exports.profile=function(req,res){
    Appointment.find({doctorId:req.user.id}).populate('patientId').exec(function(err,appointments){
        res.locals.user = req.user;
        return res.render('doc-dashboard', {
            title:"MediCare|Doctor's-Dashboard",
            apts:appointments
        });
    });
}
module.exports.addBlog=function(req,res){
    res.locals.user = req.user;
    return res.render('addBlog', {
        title:"MediCare|Add-Blog"
    })
}
module.exports.myReviews=function(req,res){
    res.locals.user = req.user;
    return res.render('myReviews', {
        title:"MediCare|Reviews"
    })
}


//render all doctor's list
module.exports.doctorList=function(req,res){
    Doctor.find(function(err, users){
        if(err){
            req.flash('error','Error in finding avilabe doctor for you')
            return res.render('/')
        }
        return res.render('doctorList', {
            title:"Available Doctors",
            users:users
        })
     });
}


module.exports.signUp = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/doctors/profile');
    }
    return res.render('sign_up', {
        title:"Patient Sign Up"
    })
     
}

module.exports.login = function(req,res){
    return res.render('sign_in', {
        title:"Doctors Log IN"
    })
}

//signUp
module.exports.create =function(req,res){
    if(req.body.pass != req.body.cpass){
        req.flash('error', 'Passwords do not match');
        return res.redirect('back');
    }
    Doctor.findOne({email: req.body.email},  function(err, doctor){
        if(err){req.flash('error', err); return}

        if(!doctor){
            Doctor.create({name:req.body.fname,lname:req.body.lname,email:req.body.email, password:req.body.pass}, function(err, doctor){
                if(err){req.flash('error', err); return}
                console.log('object is created');
                req.flash('success', 'You have signed up, login to continue!');
                return res.redirect('back')
            })
        }else{
            req.flash('error', 'Email is already is in use');
            return res.redirect('back');
        }
    });
}


//create session for loginn
module.exports.createSession =function(req,res){
    req.flash('success', 'Logged in Successfully');
    return res.redirect('/doctors/profile');
}



//destroy session for logout
module.exports.destroySession =function(req,res){
    req.logout();
    req.flash('success', 'You have logged out!');

    return res.redirect('/');
}

//editing profile
module.exports.editProfile=function(req,res){  
    return res.render('Doc_editProfile', {title:'MediCare|Edit-Profile'});
}
module.exports.saveChanges= async function(req,res){
    if(req.user.id==req.params.id){
        try{
            let user =await Doctor.findById(req.params.id);
            Doctor.uploadedAvatar(req,res,function(err){
                if(err){
                    console.log('********Multer error*****',err);
                }
                //console.log(req.file);
                user.exp=req.body.exp;
                user.name=req.body.fname;
                user.lname= req.body.lname;
                user.phoneNumber=req.body.phoneNumber;
                user.specialization=req.body.specialization;
                user.degree=req.body.degree;
                user.about=req.body.about;
                user.isavailable=req.body.aval;
                user.address.lane=req.body.lane;
                user.address.city=req.body.city;
                user.address.country=req.body.country;
                user.address.state=req.body.state;
                user.price=req.body.fees;
                if(req.file){

                    /*if(user.avatar){
                        fs.unlinkSync(path.join(__dirname,'..',user.avatar));
                    }*/
                    //saving the path of the uploaded file into the avater field of user
                    user.avatar=Doctor.avatarPath+'/'+req.file.filename;
                }
                user.save();
                return res.redirect('back');
            });
        }
        catch(err){
            req.flash('error',err);
            return res.redirect('back');
        }
    }
    else{
        return res.status(401).send('Unauthorized Access');
    }
}


//doctor profile
module.exports.docprofile=async function(req,res){
    Doctor.findById(req.params.id).exec(function(err,doctor){
        return res.render('docProfile', {
            title:'MediCare|Doctor-profile',
            doctor:doctor
        });
    });
}

//add blog
module.exports.addblog =async function(req,res){
   
    try{
        let user = await Doctor.findById(req.params.id);
        let ame=user.name +' '+ user.lname;
        Blogs.uploadedblogImg(req,res,function(err){
            if(err){
                console.log('********Multer error*****',err);
            }
            if(req.file){
                Blogs.create({blogImage:Blogs.blogsPath+'/'+req.file.filename,
                uploadBy:ame,
                title:req.body.title,
                category:req.body.category,content:req.body.content
            }, function(err, user){
                    if(err){req.flash('error', err); return}
                    req.flash('File uploaded');
                    return res.redirect('back');
                })
            }
        });
    }
    catch(err){
        req.flash('error',err);
        return res.redirect('back');
    }
}