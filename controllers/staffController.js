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
