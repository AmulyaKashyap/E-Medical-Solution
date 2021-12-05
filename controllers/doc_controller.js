const Doctor = require('../models/doctor')

module.exports.profile=function(req,res){
    res.locals.user = req.user;
    return res.render('profile', {
        title:"Doctor Profile"
    })
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

//
module.exports.create =function(req,res){
    if(req.body.pass != req.body.cpass){
        req.flash('error', 'Passwords do not match');
        return res.redirect('back');
    }

    Doctor.findOne({email: req.body.email},  function(err, doctor){
        if(err){req.flash('error', err); return}

        if(!doctor){
            Doctor.create({name:req.body.fname, email:req.body.email, password:req.body.pass, specialization:req.body.specialization}, function(err, doctor){
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