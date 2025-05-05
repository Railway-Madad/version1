const Complaint = require('../models/ComplaintModel');

// Render complaint form (GET)
exports.getComplaintForm = (req, res) => {
    res.render('complaint_form');
};

// Handle complaint submission (POST)
exports.postComplaint = async (req, res) => {
    const { username, pnr, description, issueDomain } = req.body;

    try {
        const complaint = new Complaint({
            username,
            pnr,
            description,
            issueDomain,
        });

        await complaint.save();
        res.redirect(`/complaint?success=Complaint submitted successfully!&username=${username}`);
    } catch (error) {
        console.error('Error submitting complaint:', error);
        res.render('complaint_form', { error: 'An error occurred while submitting the complaint.' });
    }
};

// Get a complaint by ID (GET)
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

// Get all complaints by a specific user (GET)
exports.getComplaintsByUser = async (req, res) => {
    try {
        const complaints = await Complaint.find({ username: req.params.username });
        res.json(complaints);
    } catch (error) {
        console.error('Error getting complaints by user:', error);
        res.status(500).send('Server error');
    }
};

// Mark a complaint as resolved (PUT)
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

// Get all complaints with pagination (GET)
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
    }
};
