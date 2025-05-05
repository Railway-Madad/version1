const Complaint = require('../models/ComplaintModel');

<<<<<<< Updated upstream
// Render the complaint form
=======
>>>>>>> Stashed changes
exports.getComplaintForm = (req, res) => {
    const { username, success, error } = req.query;
    res.render('complaint', { currentUser: username, success, error });
};

<<<<<<< Updated upstream
// Handle complaint submission
=======
>>>>>>> Stashed changes
exports.postComplaint = async (req, res) => {
    const { username, pnr, description, issueDomain } = req.body;

    if (!username || !pnr || !description || !issueDomain) {
        return res.redirect(`/complaint?error=All fields are required.&username=${username}`);
    }

    try {

        const newComplaint = new Complaint({

        const complaint = new Complaint({

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
        await complaint.save();
        res.redirect('/complaint');
    } catch (error) {
        console.error('Error submitting complaint:', error);
        res.render('complaint_form', { error: 'An error occurred while submitting the complaint.' });
    }
};

exports.getComplaintById = async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id);
        if (!complaint) {
            return res.status(404).send('Complaint not found');
        }
        res.json(complaint);
    } catch (error) {
        console.error('Error getting complaint:', error);
        res.status(500).send('Server error');
    }
};

exports.getComplaintsByUser = async (req, res) => {
    try {
        const complaints = await Complaint.find({ username: req.params.username });
        res.json(complaints);
    } catch (error) {
        console.error('Error getting complaints by user:', error);
        res.status(500).send('Server error');
    }
};

exports.resolveComplaint = async (req, res) => {
    try {
        const complaint = await Complaint.findByIdAndUpdate(
            req.params.id,
            { status: 'Resolved', resolvedAt: Date.now() },
            { new: true }
        );

        if (!complaint) {
            return res.status(404).send('Complaint not found');
        }
        res.json(complaint);
    } catch (error) {
        console.error('Error resolving complaint:', error);
        res.status(500).send('Server error');
    }
};

exports.getPaginatedComplaints = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const itemsPerPage = 5;

    try {
        const totalComplaints = await Complaint.countDocuments();
        const totalPages = Math.ceil(totalComplaints / itemsPerPage);
        const complaints = await Complaint.find()
            .skip((page - 1) * itemsPerPage)
            .limit(itemsPerPage);
        res.render('staff_dashboard', {
            staffName: 'Railway Staff',
            complaints,
            currentPage: page,
            totalPages
        });
    } catch (error) {
        console.error('Error loading paginated complaints:', error);
        res.render('staff_dashboard', {
            staffName: 'Railway Staff',
            complaints: [],
            currentPage: 1,
            totalPages: 1
        });
>>>>>>> Stashed changes
    }
};
