const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController');

router.get('/', authController.getHome);
router.get('/register', authController.getRegister);
router.post('/register', authController.postRegister);
router.post('/login', authController.postLogin);
router.get('/about', authController.getAbout);
router.get('/faq', authController.getFAQ);
router.get('/feedback', authController.getFeedback);


module.exports = router;