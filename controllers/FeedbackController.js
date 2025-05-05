const Feedback = require('../models/Feedback');

exports.getFeedback = (req, res) => {
    res.render('feedback', {
        successMessage: req.query.success || null,
        errorMessage: req.query.error || null
    });
};

exports.postFeedback = async (req, res) => {
    const { fullname, email, pnrNumber, category, rating, feedback, suggestions } = req.body;

    if (!fullname || !email || !category || !rating || !feedback) {
        return res.redirect('/feedback?error=All required fields must be filled out!');
    }

    try {
        const newFeedback = new Feedback({
            fullname,
            email,
            pnrNumber: pnrNumber || null,
            category,
            rating: parseInt(rating),
            feedback,
            suggestions: suggestions || null
        });

        await newFeedback.save();

        res.redirect('/feedback?success=Thank you for your feedback! We value your input.');
    } catch (err) {
        console.error('Error saving feedback:', err);
        res.redirect('/feedback?error=An error occurred. Please try again later.');
    }
};
