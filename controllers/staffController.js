const Complaint = require('../models/ComplaintModel');
const Staff = require('../models/StaffModel');

// Render Staff Dashboard
exports.getStaffDashboard = async (req, res) => {
    try {
        // Get the staff username from query parameters
        const { username } = req.query;

        if (!username) {
            return res.redirect('/admin'); // Redirect to login page if no username is found
        }

        // Find the staff based on the username (optional: check if staff exists)
        const staff = await Staff.findOne({ username });

        if (!staff) {
            return res.redirect('/admin'); // Redirect to login page if staff not found
        }

        const page = parseInt(req.query.page) || 1;
        const itemsPerPage = 5;

        // Fetch total number of complaints for pagination
        const totalComplaints = await Complaint.countDocuments();
        const totalPages = Math.ceil(totalComplaints / itemsPerPage);

        // Fetch the complaints for the current page
        const complaints = await Complaint.find()
            .skip((page - 1) * itemsPerPage)
            .limit(itemsPerPage)
            .sort({ createdAt: -1 });

        // Render the staff dashboard and pass the staff data (username) and complaints
        res.render('staff_dashboard', {
            staffName: staff.username,  // Pass the staff's username from query parameter
            complaints,
            currentPage: page,
            totalPages
        });
    } catch (error) {
        console.error('Error loading staff dashboard:', error);
        return res.render('staff_dashboard', { error: 'An error occurred while loading the dashboard.' });
    }
};

// Get a single complaint by ID
exports.getComplaintById = async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id);
        
        if (!complaint) {
            return res.status(404).json({ success: false, message: 'Complaint not found' });
        }
        
        res.status(200).json(complaint);
    } catch (error) {
        console.error('Error fetching complaint details:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Resolve a complaint
exports.resolveComplaint = async (req, res) => {
    try {
        const { resolutionDetails, resolutionCategory } = req.body;
        
        if (!resolutionDetails || !resolutionCategory) {
            return res.status(400).json({ 
                success: false, 
                message: 'Resolution details and category are required' 
            });
        }
        
        const complaint = await Complaint.findById(req.params.id);
        
        if (!complaint) {
            return res.status(404).json({ success: false, message: 'Complaint not found' });
        }
        
        // Update the complaint
        complaint.status = 'Resolved';
        complaint.resolutionDetails = resolutionDetails;
        complaint.resolutionCategory = resolutionCategory;
        complaint.resolvedAt = Date.now();
        
        await complaint.save();
        
        res.status(200).json({ 
            success: true, 
            message: 'Complaint resolved successfully',
            complaint 
        });
    } catch (error) {
        console.error('Error resolving complaint:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};