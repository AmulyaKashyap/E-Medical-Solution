const express = require('express');
const router = express.Router();
const home_controller=require('../controllers/home_controller');

console.log('Router is loaded.');

router.get('/',home_controller.homeP);
router.get('/home',home_controller.homeP);
router.get('/findDoc',home_controller.findDoc);
router.post('/findDocS',home_controller.findDocs);
router.get('/blogs',home_controller.blogs);


router.get('/forgotPass',home_controller.forgotPass);
router.post("/resetPass", home_controller.resetPass);

router.get("//password-reset/:userId/:token", home_controller.resettingPass);
router.post("/password-reset/:userId/:token", home_controller.resettedPass);

router.get("/videocall/:userId/:docterId", home_controller.videoCall);



module.exports = router;
router.use('/forgotPass',home_controller.forgotPass);
router.use('/aptSuccess',home_controller.aptSuccess);



router.use('/users',require('./users'));
router.use('/doctors',require('./doctors'));

//for any further routes access from here
//router.use('/routeName',require('./routerfile'));


module.exports = router;
