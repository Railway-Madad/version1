const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/ComplaintController');

router.get('/', complaintController.getComplaintForm);
router.post('/submit-complaint', complaintController.postComplaint);
router.get('/api/complaints/:id', complaintController.getComplaintById);
router.get('/api/complaints/user/:username', complaintController.getComplaintsByUser);
router.put('/api/complaints/:id/resolve', complaintController.resolveComplaint);

module.exports = router;