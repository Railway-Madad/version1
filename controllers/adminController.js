const Admin = require('../models/Admin');
const Complaint = require('../models/Complaint');
const User = require('../models/User');

exports.getAdminLogin = (req, res) => {
    res.render('admin-login');
};

exports.postAdminLogin = async (req, res) => {
    const { domain, username, password } = req.body;

    try {
        if (domain === 'admin') {
            const isAuthenticated = await Admin.authenticate(username, password);
            if (isAuthenticated) {
                const complaints = Complaint.getAll();
                const users = User.getAll();

                const totalComplaints = complaints.length;
                const pendingComplaints = complaints.filter(c => c.status === 'Pending').length;
                const resolvedComplaints = complaints.filter(c => c.status === 'Resolved').length;
                const totalUsers = users.length;

                return res.render('admin-dashboard', {
                    totalComplaints,
                    pendingComplaints,
                    resolvedComplaints,
                    totalUsers,
                    complaints: complaints.slice(0, 5)
                });
            }
            res.send('Invalid username or password. Please try again.');
        } else if (domain === 'staff') {
            const { authenticateStaff } = require('./staffController');
            const isAuthenticated = authenticateStaff(username, password);
            if (isAuthenticated) {
                return res.redirect('/staff-dashboard');
            }
            res.send('Invalid username or password. Please try again.');
        } else {
            res.send('Invalid domain selection.');
        }
    } catch (error) {
        console.error('Admin login error:', error);
        res.send('Internal server error.');
    }
};