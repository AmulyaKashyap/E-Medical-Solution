const { application } = require('express');
const express =require('express');
const { route } = require('.');
const router =express.Router();
const users_controller =require('../controllers/users_controller');

router.get('/profile',users_controller.profile);
module.exports=router;