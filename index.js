const express = require('express');
const bodyParser = require('body-parser');
const { connectDB } = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const staffRoutes = require('./routes/staffRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Connect to SQLite
connectDB();

// Routes
app.use('/', authRoutes);
app.use('/complaint', complaintRoutes);
app.use('/staff-dashboard', staffRoutes);
app.use('/admin', adminRoutes);

// Start Server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});