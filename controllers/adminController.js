const Admin = require('../models/AdminModel');
const Staff = require('../models/StaffModel');
const Complaint = require('../models/ComplaintModel');
const User = require('../models/UserModel');

exports.getAdminLogin = (req, res) => {
    res.render('admin-login', { loginError: null });
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

                // Update last login timestamp
                admin.lastLogin = new Date();
                await admin.save();

                return res.render('admin-dashboard', {
                    totalComplaints,
                    pendingComplaints,
                    resolvedComplaints,
                    totalUsers,
                    complaints: complaints.slice(0, 5),
                    adminDetails: admin
                });
            }

            return res.render('admin-login', { loginError: 'Invalid username or password.' });
        }

        if (domain === 'staff') {
            const staff = await Staff.findOne({ username });
            if (staff && await staff.comparePassword(password)) {
                return res.redirect('/staff-dashboard');
            }

            return res.render('admin-login', { loginError: 'Invalid username or password.' });
        }

        return res.render('admin-login', { loginError: 'Invalid domain selection.' });
    } catch (error) {
        console.error('Login error:', error);
        res.render('admin-login', { loginError: 'Internal server error.' });
    }
};
