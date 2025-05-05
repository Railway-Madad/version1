const express = require('express');
const bodyParser = require('body-parser');
const { connectDB } = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const staffRoutes = require('./routes/staffRoutes');
const adminRoutes = require('./routes/adminRoutes');
const mongoose = require('mongoose');
require('dotenv').config(); 

const app = express();

// Middleware
app.use(express.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Connect to SQLite
const dbURI = process.env.MONGO_URI || 'mongodb+srv://ydmalve:G5jZ5XDKo3aKjIph@cluster0.8bita43.mongodb.net/RailMadad?retryWrites=true&w=majority';

// MongoDB connection options
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
};

// Connect to MongoDB
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Successfully connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

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