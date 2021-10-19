const { application } = require('express');
const express =require('express');
const { route } = require('.');
const router =express.Router();
const users_controller =require('../controllers/doc_controller');

router.get('/create',doc_controller.create);
module.exports=router;