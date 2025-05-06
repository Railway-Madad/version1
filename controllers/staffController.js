const Complaint = require('../models/ComplaintModel');
const Staff = require('../models/StaffModel');

// Render Staff Dashboard
exports.getStaffDashboard = async (req, res) => {
    try {
        // Make sure staff is logged in
        const staff = req.session.staff;

        if (!staff) {
            return res.redirect('/admin'); // redirect to login if not logged in
        }

        const page = parseInt(req.query.page) || 1;
        const itemsPerPage = 5;

        const totalComplaints = await Complaint.countDocuments();
        const totalPages = Math.ceil(totalComplaints / itemsPerPage);

        const complaints = await Complaint.find()
            .skip((page - 1) * itemsPerPage)
            .limit(itemsPerPage)
            .sort({ createdAt: -1 });

        res.render('staff_dashboard', {
            staffName: staff.username,
            complaints,
            currentPage: page,
            totalPages
        });
    } catch (error) {
        console.error('Error loading staff dashboard:', error);
    }
};
