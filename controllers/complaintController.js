const Complaint = require('../models/ComplaintModel');

// GET /complaint - Render the complaint form
exports.getComplaintForm = (req, res) => {
    const currentUser = req.session?.user?.username || null;
    res.render('complaint', { 
        currentUser,
        success: req.query.success || false,
        error: req.query.error || false
    });
};

// POST /complaint - Handle complaint submission
exports.postComplaint = async (req, res) => {
    try {
        const { username, pnr, description, issueDomain } = req.body;

        const complaint = new Complaint({
            username,
            pnr,
            description,
            issueDomain
        });

        await complaint.save();
        res.redirect('/complaint?success=true');
    } catch (error) {
        console.error('Error submitting complaint:', error);
        res.redirect('/complaint?error=true');
    }
};

// GET /complaint/:id - Get complaint by ID
exports.getComplaintById = async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id);
        if (!complaint) {
            return res.status(404).json({ error: 'Complaint not found' });
        }
        res.json(complaint);
    } catch (error) {
        console.error('Error getting complaint:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// GET /complaints/user/:username - Get all complaints by username
exports.getComplaintsByUser = async (req, res) => {
    try {
        const complaints = await Complaint.find({ username: req.params.username });
        res.json(complaints);
    } catch (error) {
        console.error('Error getting complaints by user:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// PUT /complaint/resolve/:id - Resolve a complaint
exports.resolveComplaint = async (req, res) => {
    try {
        const complaint = await Complaint.findByIdAndUpdate(
            req.params.id,
            {
                status: 'Resolved',
                resolvedAt: Date.now(),
                resolutionDetails: req.body.resolutionDetails || ''
            },
            { new: true }
        );

        if (!complaint) {
            return res.status(404).json({ error: 'Complaint not found' });
        }

        res.json(complaint);
    } catch (error) {
        console.error('Error resolving complaint:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// GET /complaints?page=1 - Paginated complaints (for staff dashboard)
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
