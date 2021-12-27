const express = require('express');
const router = express.Router();
const home_controller=require('../controllers/home_controller');

console.log('Router is loaded.');

router.get('/',home_controller.homeP);
router.get('/home',home_controller.homeP);
router.get('/findDoc',home_controller.findDoc);
router.get('/blogs',home_controller.blogs);
router.use('/users',require('./users'));
router.use('/doctors',require('./doctors'));
router.get('/findDoc',home_controller.findDoc);



router.get('/forgotPass',home_controller.forgotPass);
router.post("/resetPass", home_controller.resetPass);

router.get("//password-reset/:userId/:token", home_controller.resettingPass);
router.get("//password-reset/:userId/:token", home_controller.resettingPass);

router.post("/password-reset/:userId/:token", home_controller.resettedPass);





module.exports = router;

//for any further routes access from here
//router.use('/routeName',require('./routerfile'));


module.exports = router;
