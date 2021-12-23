const { application } = require('express');
const express =require('express');
const { route } = require('.');
const router =express.Router();
const passport=require('passport');
const users_controller =require('../controllers/users_controller');



router.get('/profile', passport.checkAuthentication, users_controller.profile);

//open chatBot
router.get('/chatBot',users_controller.chatBot);    
router.get('/sign-in',users_controller.signIn);
router.get('/sign-up',users_controller.signUp);
router.get('/sign-out',users_controller.destroySession);



router.get('/authentication/google',passport.authenticate('google', {scope:['profile', 'email']}));
router.get('/authentication/google/callback',passport.authenticate('google', {failureRedirect: '/users/sign-in'}),users_controller.createSession);

router.post('/create', users_controller.create);
//router.post('/callDoctor', users_controller.consultDoctor);
//redirect to paytm 
router.post('/paynow', users_controller.payment);
//received response from paytm
router.post('/paytm/callback', users_controller.paymentCallback);
//first-patient   second-doctor
router.get('/:first/:second/chat', users_controller.callnow);
  
router.get('/bookAppointment/:doctor_id', users_controller.bookAppointment);

//using passport middleware
router.post('/create-session',passport.authenticate('patient',{failureRedirect:'/users/sign-in'}), users_controller.createSession);


module.exports=router;