const express = require('express');
const router = express.Router();
const upload = require('../config/upload');
const { uploadImage, getLatestNews } = require('../controllers/newsController');  // Destructure correctly

router.post('/upload', upload.single('image'), uploadImage);
router.get('/latest', getLatestNews);

module.exports = router;