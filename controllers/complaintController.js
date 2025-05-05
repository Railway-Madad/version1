const Complaint = require('../models/ComplaintModel');

// Render complaint form (GET request)
exports.getComplaintForm = (req, res) => {
    res.render('complaint', { error: null });
};

// Handle complaint submission (POST request)
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

        // Optionally, pass a success message or redirect to a thank-you page
        res.redirect('/complaint'); // Redirect to form again
    } catch (error) {
        console.error('Error submitting complaint:', error);
        res.render('complaint', { error: 'An error occurred while submitting the complaint.' });
    }
};

// Get a single complaint by ID
exports.getComplaintById = async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id);
        if (!complaint) {
            return res.status(404).send('Complaint not found');
        }

        res.render('complaint_detail', { complaint }); // Optional: render a detailed view
    } catch (error) {
        console.error('Error getting complaint by ID:', error);
        res.status(500).send('Server error');
    }
};

// Get all complaints for a user
exports.getComplaintsByUser = async (req, res) => {
    try {
        const complaints = await Complaint.find({ username: req.params.username });
        res.render('user_complaints', { complaints, username: req.params.username });
    } catch (error) {
        console.error('Error getting complaints by user:', error);
        res.status(500).send('Server error');
    }
};

// Resolve a complaint by ID
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

        res.redirect('/staff/complaints'); // Adjust if your dashboard route is different
    } catch (error) {
        console.error('Error resolving complaint:', error);
        res.status(500).send('Server error');
    }
};

// Get all complaints with pagination
exports.getPaginatedComplaints = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const itemsPerPage = 5;

    try {
        const totalComplaints = await Complaint.countDocuments();
        const totalPages = Math.ceil(totalComplaints / itemsPerPage);

        const complaints = await Complaint.find()
            .skip((page - 1) * itemsPerPage)
            .limit(itemsPerPage)
            .sort({ createdAt: -1 }); // Optional: show newest first

        res.render('staff_dashboard', {
            staffName: 'Railway Staff',
            complaints,
            currentPage: page,
            totalPages,
        });
    } catch (error) {
        console.error('Error loading paginated complaints:', error);
        res.render('staff_dashboard', {
            staffName: 'Railway Staff',
            complaints: [],
            currentPage: 1,
            totalPages: 1,
            error: 'Failed to load complaints.',
        });
    }
};
