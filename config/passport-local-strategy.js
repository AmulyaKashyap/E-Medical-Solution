const passport  = require('passport');
const LocalStrategy = require('passport-local').Strategy;


const User = require('../models/user');
const Doctor = require('../models/doctor');

//authenticate patient
passport.use('patient',new LocalStrategy({
    usernameField: 'email',
    passwordField:'pass',
    passReqToCallback: true
    },
    function(req,email,password,done){
        User.findOne({email:email}, function(err, user){
            if(err){
                console.log('Error in finding user-->Passport');
                req.flash('error', err);

            }

            if(!user || user.password != password){
                console.log('Inalid Username/password');
                req.flash('error', 'Invalid Username/Password');
                return done(null, false);
            }

            return done(null, user);
        });        
    }

));   

//authenticate doctor
passport.use('doctor',new LocalStrategy({
    usernameField: 'email',
    passwordField:'pass',
    passReqToCallback: true
    },
    function(req,email,password,done){
        Doctor.findOne({email:email}, function(err, user){
            if(err){
                console.log('Error in finding user-->Passport');
                req.flash('error', err);

            }

            if(!user || user.password != password){
                console.log('Inalid Username/password');
                req.flash('error', 'Invalid Username/Password');
                return done(null, false);
            }
            return done(null, user);
        });        
    }

));   






//serializing the user 
passport.serializeUser(function(user,done) {
    return done(null, {_id:user.id, isDoctor:user.isDoctor});
});



//deserializing the user 
passport.deserializeUser(function(login, done){
    if(!login.isDoctor){
        User.findById(login, function(err, user){
            if(err){
                console.log('Error in finding user-->Passport');
                return done(err);
            }
            return done(null, user);
        });
    }
    else if(login.isDoctor){
        Doctor.findById(login, function(err, user){
            if(err){
                console.log('Error in finding user-->Passport');
                return done(err);
            }
            return done(null, user);
        });
    }

});

//checking user authentication 
passport.checkAuthentication = function(req,res,next){
    console.log("from checkAuthentication")
    //if user is signed in
    if(req.isAuthenticated()){
        return next();
    }
    //if user is not signed in
    return res.redirect('/'); 
}

passport.setAuthenticatedUser  = function(req,res,next){
    if(req.isAuthenticated()){
        //res.user contains current user from session cookie and assigned to locals for views
        res.locals.user = req.user;
    }
    next();
}


module.exports =  passport;