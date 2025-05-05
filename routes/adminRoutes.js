const express = require('express');
const router = express.Router();
const adminController = require('../controllers/AdminController');

router.get('/', adminController.getAdminLogin);
router.post('/admin-login', adminController.postAdminLogin);

module.exports = router;