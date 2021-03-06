const { application } = require('express');
const express =require('express');
const app = express();
const router =express.Router();
const passport=require('passport');
const doc_controller =require('../controllers/doc_controller');

router.get('/profile', passport.checkAuthentication,  doc_controller.profile);
router.get('/docprofile/:id', doc_controller.docprofile);
router.get('/login',doc_controller.login);
router.get('/sign-up',doc_controller.signUp);
router.get('/sign-out',doc_controller.destroySession);
router.get('/addBlog',doc_controller.addBlog);
router.get('/myReviews',doc_controller.myReviews);
//render all doctor's list
router.get('/list',doc_controller.doctorList);
router.get('/editProfile',doc_controller.editProfile);
router.post('/saveChanges/:id',doc_controller.saveChanges);


router.get('/authentication/google',passport.authenticate('doctor', {scope:['profile', 'email']}));
router.get('/authentication/google/callback',passport.authenticate('doctor', {failureRedirect: '/doctors/sign-in'}),doc_controller.createSession);

router.post('/create',doc_controller.create);
router.post('/addblog/:id',doc_controller.addblog);
//using passport middleware
router.post('/create-session',passport.authenticate('doctor',{failureRedirect:'/doctors/login'}),doc_controller.createSession);
 

module.exports=router;