const Admin = require('../models/AdminModel');
const Complaint = require('../models/ComplaintModel');
const User = require('../models/UserModel');

// Render the admin login page
exports.getAdminLogin = (req, res) => {
    res.render('admin-login');
};

// Admin login functionality with Mongoose
exports.postAdminLogin = async (req, res) => {
    const { domain, username, password } = req.body;

    try {
        // Check if the domain is 'admin'
        if (domain === 'admin') {
            // Authenticate admin user using Mongoose
            const admin = await Admin.findOne({ username });
            if (admin && admin.password === password) {
                // Simulate the dashboard data
                const complaints = await Complaint.find();
                const users = await User.find();

                const totalComplaints = complaints.length;
                const pendingComplaints = complaints.filter(c => c.status === 'Pending').length;
                const resolvedComplaints = complaints.filter(c => c.status === 'Resolved').length;
                const totalUsers = users.length;

                // Render the admin dashboard with data
                return res.render('admin-dashboard', {
                    totalComplaints,
                    pendingComplaints,
                    resolvedComplaints,
                    totalUsers,
                    complaints: complaints.slice(0, 5), // Display first 5 complaints
                });
            }
            res.send('Invalid username or password. Please try again.');
        } 
        // Check if the domain is 'staff'
        else if (domain === 'staff') {
            // Staff authentication (assuming you have a staffController function)
            const { authenticateStaff } = require('./staffController');
            const isAuthenticated = authenticateStaff(username, password);
            if (isAuthenticated) {
                return res.redirect('/staff-dashboard');
            }
            res.send('Invalid username or password. Please try again.');
        } 
        // Invalid domain case
        else {
            res.send('Invalid domain selection.');
        }
    } catch (error) {
        console.error('Admin login error:', error);
        res.send('Internal server error.');
    }
};

exports.postAdminLogin = async (req, res) => {
    const { domain, username, password } = req.body;

    try {
        if (domain === 'admin') {
            const admin = await Admin.findOne({ username });
            if (admin && await admin.comparePassword(password)) {
                const complaints = await Complaint.find();
                const users = await User.find();

                const totalComplaints = complaints.length;
                const pendingComplaints = complaints.filter(c => c.status === 'Pending').length;
                const resolvedComplaints = complaints.filter(c => c.status === 'Resolved').length;
                const totalUsers = users.length;

                return res.render('admin-dashboard', {
                    totalComplaints,
                    pendingComplaints,
                    resolvedComplaints,
                    totalUsers,
                    complaints: complaints.slice(0, 5),
                });
            }
            res.send('Invalid username or password. Please try again.');
        } 
        else if (domain === 'staff') {
            const { authenticateStaff } = require('./staffController');
            const isAuthenticated = authenticateStaff(username, password);
            if (isAuthenticated) {
                return res.redirect('/staff-dashboard');
            }
            res.send('Invalid username or password. Please try again.');
        } 
        else {
            res.send('Invalid domain selection.');
        }
    } catch (error) {
        console.error('Admin login error:', error);
        res.send('Internal server error.');
    }
};
