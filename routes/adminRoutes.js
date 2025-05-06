const express = require('express');
const router = express.Router();
const adminController = require('../controllers/AdminController');

router.get('/', adminController.getAdminLogin);
router.post('/admin-login', adminController.postAdminLogin);
router.post('/register-staff', adminController.registerStaff);

module.exports = router;
