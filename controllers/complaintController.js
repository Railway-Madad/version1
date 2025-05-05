const Complaint = require('../models/Complaint');

exports.getComplaintForm = (req, res) => {
    res.render('complaint', {
        success: req.query.success,
        error: req.query.error,
        currentUser: req.query.username
    });
};

exports.postComplaint = async (req, res) => {
    try {
        const { username, pnr, description, issueDomain } = req.body;
        if (!username || !pnr || !description || !issueDomain) {
            return res.redirect('/complaint?error=true&message=All fields are required');
        }

        const newComplaint = Complaint.create({ username, pnr, description, issueDomain });
        res.redirect(`/complaint?success=true&username=${username}`);
    } catch (error) {
        console.error('Error submitting complaint:', error);
        res.redirect('/complaint?error=true&message=Internal server error');
    }
};

exports.getComplaintById = (req, res) => {
    const complaint = Complaint.findById(req.params.id);
    if (complaint) {
        res.json(complaint);
    } else {
        res.status(404).json({ error: 'Complaint not found' });
    }
};

exports.getComplaintsByUser = (req, res) => {
    try {
        const userComplaints = Complaint.findByUsername(req.params.username);
        res.json(userComplaints);
    } catch (error) {
        console.error('Error fetching complaints:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.resolveComplaint = async (req, res) => {
    try {
        const { resolutionDetails, resolutionCategory } = req.body;
        if (!resolutionDetails || !resolutionCategory) {
            return res.status(400).json({ error: 'Missing resolution details or category' });
        }

        const updatedComplaint = Complaint.update(req.params.id, {
            status: 'Resolved',
            resolutionDetails,
            resolutionCategory,
            resolvedAt: new Date().toISOString()
        });

        if (!updatedComplaint) {
            return res.status(404).json({ error: 'Complaint not found' });
        }

        res.json(updatedComplaint);
    } catch (error) {
        console.error('Error resolving complaint:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};