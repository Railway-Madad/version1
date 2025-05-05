const Complaint = require('../models/ComplaintModel');

// Render complaint form (GET request)
exports.getComplaintForm = (req, res) => {
    res.render('complaint_form');
};

// Handle complaint submission (POST request)
exports.postComplaint = async (req, res) => {
    const { username, pnr, description, issueDomain } = req.body;

    try {
        // Create a new complaint object
        const complaint = new Complaint({
            username,
            pnr,
            description,
            issueDomain,
        });

        // Save the complaint to the database
        await complaint.save();
        // Redirect to the complaints page after submission
        res.redirect('/complaint');
    } catch (error) {
        console.error('Error submitting complaint:', error);
        // Render the complaint form with an error message
        res.render('complaint_form', { error: 'An error occurred while submitting the complaint.' });
    }
};

// Get complaint by ID (GET request)
exports.getComplaintById = async (req, res) => {
    try {
        // Find the complaint by its ID
        const complaint = await Complaint.findById(req.params.id);
        if (!complaint) {
            return res.status(404).send('Complaint not found');
        }
        // Return the complaint as JSON response
        res.json(complaint);
    } catch (error) {
        console.error('Error getting complaint:', error);
        res.status(500).send('Server error');
    }
};

// Get all complaints for a user (GET request)
exports.getComplaintsByUser = async (req, res) => {
    try {
        // Find all complaints by the username
        const complaints = await Complaint.find({ username: req.params.username });
        // Return the list of complaints as JSON response
        res.json(complaints);
    } catch (error) {
        console.error('Error getting complaints by user:', error);
        res.status(500).send('Server error');
    }
};

// Resolve a complaint by ID (PUT request)
exports.resolveComplaint = async (req, res) => {
    try {
        // Find the complaint by ID and update its status to 'Resolved'
        const complaint = await Complaint.findByIdAndUpdate(
            req.params.id,
            { status: 'Resolved', resolvedAt: Date.now() },
            { new: true }
        );

        if (!complaint) {
            return res.status(404).send('Complaint not found');
        }
        // Return the updated complaint as a JSON response
        res.json(complaint);
    } catch (error) {
        console.error('Error resolving complaint:', error);
        res.status(500).send('Server error');
    }
};

// Get all complaints with pagination (GET request)
exports.getPaginatedComplaints = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const itemsPerPage = 5;

    try {
        // Get the total number of complaints in the database
        const totalComplaints = await Complaint.countDocuments();
        const totalPages = Math.ceil(totalComplaints / itemsPerPage);
        const complaints = await Complaint.find()
            .skip((page - 1) * itemsPerPage)
            .limit(itemsPerPage);

        // Return the paginated list of complaints
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
