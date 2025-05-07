const express = require('express');
const bodyParser = require('body-parser');
const { connectDB } = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const staffRoutes = require('./routes/staffRoutes');
const adminRoutes = require('./routes/adminRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const newsRoutes = require('./routes/newsRoutes')



const app = express();

app.use(express.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use('/uploads', express.static('uploads')); 

connectDB();

//dont have route of user 
app.use('/', authRoutes);
app.use('/complaint', complaintRoutes);
app.use('/staff-dashboard', staffRoutes);
app.use('/admin', adminRoutes);
app.use('/feedback', feedbackRoutes); 
app.use('/news',newsRoutes)



const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
