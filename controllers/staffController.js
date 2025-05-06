const Complaint = require('../models/ComplaintModel');
const Staff = require('../models/StaffModel');

// Render Staff Dashboard
exports.getStaffDashboard = async (req, res) => {
    try {
        const { username } = req.query;
        if (!username) return res.redirect('/admin');

        const staff = await Staff.findOne({ username });
        if (!staff) return res.redirect('/admin');

        const domainMap = {
            cleaning: ['Cleanliness', 'Other'],
            ticketing: ['Facilities', 'Delay', 'Other'],
            security: ['Staff Behavior','Other'],
            maintenance: ['Facilities', 'Other'],
            admin: ['Cleanliness', 'Staff Behavior', 'Catering', 'Delay', 'Facilities', 'Other']
        };

        const issueDomains = domainMap[staff.domain] || [];

        const page = parseInt(req.query.page) || 1;
        const itemsPerPage = 5;

        const query = staff.domain === 'admin' ? {} : { issueDomain: { $in: issueDomains } };

        const totalComplaints = await Complaint.countDocuments(query);
        const totalPages = Math.ceil(totalComplaints / itemsPerPage);

        const complaints = await Complaint.find(query)
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
        res.render('staff_dashboard', { error: 'An error occurred while loading the dashboard.' });
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