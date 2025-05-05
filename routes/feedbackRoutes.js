const express = require('express');
const router = express.Router();
const FeedbackController = require('../controllers/FeedbackController');

router.get('/', FeedbackController.getFeedback);
router.post('/', FeedbackController.postFeedback);

module.exports = router;
