const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/ComplaintController');
const multer = require('multer');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });

router.get('/', complaintController.getComplaintForm);
router.post('/submit-complaint', upload.single('image'), complaintController.postComplaint);
router.get('/api/complaints/:id', complaintController.getComplaintById);
router.get('/api/complaints/user/:username', complaintController.getComplaintsByUser);
router.put('/api/complaints/:id/resolve', complaintController.resolveComplaint);
router.get('/upload-image', complaintController.getUploadForm);
router.post('/upload-image', upload.single('image'), complaintController.postImage);
router.get('/api/images/user/:username', complaintController.getImagesByUser);

module.exports = router;