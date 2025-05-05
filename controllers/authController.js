const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Render the registration page
exports.getRegister = (req, res) => {
    res.render('register', { registerError: null });
};

// Handle user registration
exports.postRegister = async (req, res) => {
    const { fullname, email, username, password, confirmPassword } = req.body;

    // Check if all required fields are provided
    if (!fullname || !email || !username || !password) {
        return res.render('register', { registerError: 'All fields are required' });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
        return res.render('register', { registerError: 'Passwords do not match' });
    }

    try {
        // Check if username or email already exists in the database
        const existingUserByUsername = await User.findOne({ username });
        const existingUserByEmail = await User.findOne({ email });

        if (existingUserByUsername) {
            return res.render('register', { registerError: 'Username already taken' });
        }

        if (existingUserByEmail) {
            return res.render('register', { registerError: 'Email already registered' });
        }

        // Hash the password before saving the new user
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create and save the new user to the database
        const newUser = new User({
            fullname,
            email,
            username,
            password: hashedPassword
        });

        await newUser.save();

        // Redirect to the complaint page with a success message
        res.redirect(`/complaint?success=Registration successful! Welcome, ${username}&username=${username}`);
    } catch (error) {
        console.error('Registration error:', error);
        res.render('register', { registerError: 'An error occurred during registration' });
    }
};

// Handle user login
exports.postLogin = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find user by username or email
        const user = await User.findOne({ $or: [{ username }, { email: username }] });

        // If user not found or passwords do not match
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.render('home', { loginError: 'Invalid username or password' });
        }

        // If login is successful, render the complaints page
        res.render('complaint', {
            success: null,
            error: null,
            currentUser: user.username
        });
    } catch (error) {
        console.error('Login error:', error);
        res.render('home', { loginError: 'An error occurred during login' });
    }
};

// Render the home page
exports.getHome = (req, res) => {
    res.render('home');
};

// Render the about us page
exports.getAbout = (req, res) => {
    res.render('aboutus');
};

// Render the FAQ page
exports.getFAQ = (req, res) => {
    res.render('faq');
};

// Render the feedback page
exports.getFeedback = (req, res) => {
    res.render('feedback');
};
