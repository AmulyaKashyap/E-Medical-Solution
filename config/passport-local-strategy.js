const passport  = require('passport');
const LocalStrategy = require('passport-local').Strategy;


const User = require('../models/user');

//authenticate
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField:'pass'
    },
    function(email,password,done){
        User.findOne({email:email}, function(err, user){
            if(err){
                console.log('Error in finding user-->Passport');
            }

            if(!user || user.password != password){
                console.log('Inalid Username/password');
                return done(null, false);
            }

            return done(null, user);
        });        
    }

));   






//serializing the user 
passport.serializeUser(function(user,done) {
    done(null, user.id);

});





//deserializing the user 
passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        if(err){
            console.log('Error in finding user-->Passport');
            return done(err);
        }

        return done(null, user);

    });

});

//checking user authentication 
passport.checkAuthentication = function(req,res,next){
    //if user is signed in
    if(req.isAuthenticated()){
        return next();
    }

    //if user is not signed in
    return res.redirect('/users/sign-in'); 
}


passport.setAuthenticatedUser  = function(req,res,next){
    if(req.isAuthenticated()){
        //res.user contains current user from session cookie and assigned to locals for views
        res.locals.user = req.user;
    }
    next();
}


module.exports =  passport;