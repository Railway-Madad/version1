const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    fullname: { type: String, required: true },
    email: { type: String, required: true },
    pnrNumber: { type: String },
    category: { type: String, required: true },
    rating: { type: Number, required: true },
    feedback: { type: String, required: true },
    suggestions: { type: String },
    submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Feedback', feedbackSchema);
