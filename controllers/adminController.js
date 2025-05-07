const Admin = require('../models/AdminModel');
const Staff = require('../models/StaffModel');
const Complaint = require('../models/ComplaintModel');
const User = require('../models/UserModel');
const Feedback = require('../models/Feedback');


exports.getAdminLogin = (req, res) => {
    res.render('admin-login', { loginError: null });
};

exports.postAdminLogin = async (req, res) => {
    const { domain, username, password } = req.body;

    try {
        if (domain === 'admin') {
            const admin = await Admin.findOne({ username });
            if (admin && await admin.comparePassword(password)) {
                const complaints = await Complaint.find().sort({ createdAt: -1 });;
                const users = await User.find();

                const totalComplaints = complaints.length;
                const pendingComplaints = complaints.filter(c => c.status === 'Pending').length;
                const resolvedComplaints = complaints.filter(c => c.status === 'Resolved').length;
                const totalUsers = users.length;

                // Update last login timestamp
                admin.lastLogin = new Date();
                await admin.save();

                let feedbacks = await Feedback.find().sort({ submittedAt: -1 });

                let totalFeedbacks = feedbacks.length;

                const averageRating = totalFeedbacks > 0
                  ? (feedbacks.reduce((sum, fb) => sum + (fb.rating || 0), 0) / totalFeedbacks).toFixed(1)
                  : 'N/A';

                const feedbackByCategory = {};
                feedbacks.forEach(fb => {
                  feedbackByCategory[fb.category] = (feedbackByCategory[fb.category] || 0) + 1;
                });

                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const skip = (page - 1) * limit;

                feedbacks = await Feedback.find()
                    .sort({ rating: 1 }) // Sort by rating (ascending)
                    .skip(skip)
                    .limit(limit);

                totalFeedbacks = await Feedback.countDocuments();


                return res.render('admin-dashboard', {
                    totalComplaints,
                    pendingComplaints,
                    resolvedComplaints,
                    totalUsers,
                    complaints: complaints.slice(0, 5),
                    adminDetails: admin,
                    feedbacks,
                    totalFeedbacks,
                    averageRating,
                    feedbackByCategory,
                    currentPage: page,
                    totalPages: Math.ceil(totalFeedbacks / limit),
                    limit // Add this line to pass the limit to the template
                });
            }

            return res.render('admin-login', { loginError: 'Invalid username or password.' });
        }

        if (domain === 'staff') {
            const staff = await Staff.findOne({ username });
            if (staff && await staff.comparePassword(password)) {
                return res.redirect(`/staff-dashboard?username=${staff.username}`);
            }

            return res.render('admin-login', { loginError: 'Invalid username or password.' });
        }

        return res.render('admin-login', { loginError: 'Invalid domain selection.' });
    } catch (error) {
        console.error('Login error:', error);
        res.render('admin-login', { loginError: 'Internal server error.' });
    }
};

exports.registerStaff = async (req, res) => {
    try {
      const { username, password, domain } = req.body;
  
      if (!username || !password || !domain) {
        return res.status(400).send('All fields are required.');
      }
  
      const existingStaff = await Staff.findOne({ username });
      if (existingStaff) {
        return res.status(409).send('Username already exists.');
      }
  
      const newStaff = new Staff({ username, password, domain });
      await newStaff.save();
  
      // Reload admin dashboard with updated data
      const complaints = await Complaint.find().sort({ createdAt: -1 });
      const users = await User.find();
      const admin = await Admin.findOne(); // optionally filter by session/admin
  
      const totalComplaints = complaints.length;
      const pendingComplaints = complaints.filter(c => c.status === 'Pending').length;
      const resolvedComplaints = complaints.filter(c => c.status === 'Resolved').length;
      const totalUsers = users.length;

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      let feedbacks = await Feedback.find()
                    .sort({ submittedAt: -1 })
                    .skip(skip)
                    .limit(limit);

      const totalFeedbacks = await Feedback.countDocuments();

      const averageRating = totalFeedbacks > 0
        ? (feedbacks.reduce((sum, fb) => sum + (fb.rating || 0), 0) / totalFeedbacks).toFixed(1)
        : 'N/A';

      const feedbackByCategory = {};
      feedbacks.forEach(fb => {
        feedbackByCategory[fb.category] = (feedbackByCategory[fb.category] || 0) + 1;
      });

  
      return res.render('admin-dashboard', {
        totalComplaints,
        pendingComplaints,
        resolvedComplaints,
        totalUsers,
        complaints: complaints.slice(0, 5),
        adminDetails: admin,
        feedbacks,
        totalFeedbacks,
        averageRating,
        feedbackByCategory,
        currentPage: page,
        totalPages: Math.ceil(totalFeedbacks / limit),
        limit // Add this line to pass the limit to the template
      });
    
  
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal server error.');
    }
  };