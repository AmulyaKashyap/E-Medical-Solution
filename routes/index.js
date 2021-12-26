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
router.use('/forgotPass',home_controller.forgotPass);

//for any further routes access from here
//router.use('/routeName',require('./routerfile'));


module.exports = router;
