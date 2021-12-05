const express = require('express');
const router = express.Router();
const home_controller=require('../controllers/home_controller');

console.log('Router is loaded.');

router.get('/',home_controller.home);
router.use('/users',require('./users'));
router.use('/doctors',require('./doctors'));

//for any further routes access from here
//router.use('/routeName',require('./routerfile'));


module.exports = router;
