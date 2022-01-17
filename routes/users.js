const { application } = require('express');
const express =require('express');
const router =express.Router();
const passport=require('passport');
const users_controller =require('../controllers/users_controller');



router.get('/profile', passport.checkAuthentication, users_controller.profile);


//open chatBot
router.get('/chatBot',users_controller.chatBot);    
router.get('/sign-in',users_controller.signIn);
router.get('/sign-up',users_controller.signUp);
router.get('/sign-out',users_controller.destroySession);
router.post('/saveChanges/:id',users_controller.saveChanges);
router.post('/add-report/:id',users_controller.uploadReports);
router.get('/editProfile',users_controller.editProfile);
router.get('/reports',users_controller.reports);
router.get('/prescriptions',users_controller.prescriptions);
router.get('/review',users_controller.review);
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


router.post('/updateSugar/:id',users_controller.updateSugar);
router.post('/updateWeight/:id',users_controller.updateWeight);
router.post('/updateTemp/:id',users_controller.updateTemp);
router.post('/updateBP/:id',users_controller.updateBP);


module.exports=router;