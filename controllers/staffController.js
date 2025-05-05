const fs = require('fs');
const path = require('path');
const Complaint = require('../models/Complaint');

const STAFF_FILE = path.join(__dirname, '../data/staff.json');

exports.getStaffDashboard = (req, res) => {
    try {
        const complaints = Complaint.getAll();
        const page = parseInt(req.query.page) || 1;
        const itemsPerPage = 5;
        const startIndex = (page - 1) * itemsPerPage;
        const paginatedComplaints = complaints.slice(startIndex, startIndex + itemsPerPage);
        const totalPages = Math.ceil(complaints.length / itemsPerPage);

        res.render('staff_dashboard', {
            staffName: 'Railway Staff',
            complaints: paginatedComplaints,
            currentPage: page,
            totalPages
        });
    } catch (error) {
        console.error('Error loading complaints:', error);
        res.render('staff_dashboard', {
            staffName: 'Railway Staff',
            complaints: [],
            currentPage: 1,
            totalPages: 1
        });
    }
};

exports.authenticateStaff = (username, password) => {
    try {
        const data = fs.readFileSync(STAFF_FILE, 'utf8');
        const users = JSON.parse(data);
        return users.some(user => user.username === username && user.password === password);
    } catch (error) {
        console.error('Error reading staff.json:', error);
        return false;
    }
};