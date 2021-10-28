const User = require('../models/user')

module.exports.profile=function(req,res){
    res.end('<h1>User Profile</h1>');
}


module.exports.signUp = function(req,res){
    return res.render('sign_up', {
        title:"Patient Sign Up"
    })
     
}

module.exports.signIn = function(req,res){
    return res.render('sign_up', {
        title:"Patient Sign Up"
    })
     
}

//
module.exports.create =function(req,res){
    if(req.body.pass != req.body.cpass){
        return res.redirect('back');
    }

    User.findOne({email: req.body.email},  function(err, user){
        if(err){console.log('error in findig user in signing up'); return}

        if(!user){
            User.create({name:req.body.fname, email:req.body.email, password:req.body.pass}, function(err, user){
                if(err){console.log('error in creating user while signing up'); return}

                console.log('object is created');
                return res.redirect('/users/profile')
            })
        }else{
            console.log('Email is already used');
            return res.redirect('back');
        }

    });

}


//create session for loginn
module.exports.createSession =function(req,res){
    //todo
}