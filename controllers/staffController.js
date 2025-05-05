const Complaint = require('../models/ComplaintModel');
const Staff = require('../models/StaffModel');
const bcrypt = require('bcryptjs');

// Render Staff Dashboard
exports.getStaffDashboard = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.render('staff_login', { error: 'Username and password are required' });
    }

    try {
        const staff = await Staff.findOne({ username });
        if (!staff) {
            return res.render('staff_login', { error: 'Invalid username or password' });
        }

        const isMatch = await bcrypt.compare(password, staff.password);
        if (!isMatch) {
            return res.render('staff_login', { error: 'Invalid username or password' });
        }

        // Auth successful, fetch complaints
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
        res.render('staff_login', { error: 'An error occurred during login' });
    }
};

// Authenticate Staff Login
exports.authenticateStaff = async (username, password) => {
    try {
        const staff = await Staff.findOne({ username });
        if (!staff) return false;

        const isMatch = await bcrypt.compare(password, staff.password);
        return isMatch;
    } catch (error) {
        console.error('Error authenticating staff:', error);
        return false;
    }
};
exports.registerStaff = async (req, res) => {
    const { username, password, domain } = req.body;

    if (!username || !password || !domain) {
        return res.render('staff_register', { error: 'All fields are required' });
    }

    try {
        // Check if username already exists
        const existingStaff = await Staff.findOne({ username });
        if (existingStaff) {
            return res.render('staff_register', { error: 'Username already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new staff
        const newStaff = new Staff({
            username,
            password: hashedPassword,
            domain
        });

        await newStaff.save();

        res.redirect('/staff/login?success=Staff registered successfully');
    } catch (error) {
        console.error('Staff registration error:', error);
        res.render('staff_register', { error: 'An error occurred during registration' });
    }
};
