const Complaint = require('../models/ComplaintModel');

// Render the complaint form
exports.getComplaintForm = (req, res) => {
    const { username, success, error } = req.query;
    res.render('complaint', { currentUser: username, success, error });
};

// Handle complaint submission
exports.postComplaint = async (req, res) => {
    const { username, pnr, description, issueDomain } = req.body;

    if (!username || !pnr || !description || !issueDomain) {
        return res.redirect(`/complaint?error=All fields are required.&username=${username}`);
    }

    try {
        const newComplaint = new Complaint({
            username,
            pnr,
            description,
            issueDomain
        });

        await newComplaint.save();
        res.redirect(`/complaint?success=Complaint submitted successfully!&username=${username}`);
    } catch (err) {
        console.error('Error saving complaint:', err);
        res.redirect(`/complaint?error=Something went wrong. Please try again.&username=${username}`);
    }
};

// View all complaints (for admin or dashboard)
exports.getAllComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find().sort({ createdAt: -1 });
        res.render('admin-dashboard', { complaints });
    } catch (err) {
        console.error('Error fetching complaints:', err);
        res.send('Error fetching complaints.');
    }
};

// Resolve a complaint
exports.resolveComplaint = async (req, res) => {
    const { id } = req.params;
    const { resolutionDetails, resolutionCategory } = req.body;

    try {
        await Complaint.findByIdAndUpdate(id, {
            status: 'Resolved',
            resolutionDetails,
            resolutionCategory,
            resolvedAt: new Date()
        });

        res.redirect('/admin-dashboard');
    } catch (err) {
        console.error('Error resolving complaint:', err);
        res.send('Error resolving complaint.');
    }
};
