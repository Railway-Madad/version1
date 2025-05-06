const User = require('../models/UserModel');
const bcrypt = require('bcryptjs');

exports.getRegister = (req, res) => {
    res.render('register', { registerError: null });
};

exports.postRegister = async (req, res) => {
    const { fullname, email, username, password, confirmPassword } = req.body;

    if (!fullname || !email || !username || !password) {
        return res.render('register', { registerError: 'All fields are required', registerSuccess: null });
    }

    if (password !== confirmPassword) {
        return res.render('register', { registerError: 'Passwords do not match', registerSuccess: null });
    }

    try {
        const existingUserByUsername = await User.findOne({ username });
        const existingUserByEmail = await User.findOne({ email });

        if (existingUserByUsername) {
            return res.render('register', { registerError: 'Username already taken', registerSuccess: null });
        }

        if (existingUserByEmail) {
            return res.render('register', { registerError: 'Email already registered', registerSuccess: null });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullname,
            email,
            username,
            password: hashedPassword
        });

        await newUser.save();

        // Pass success flag to view
        return res.render('register', { registerError: null, registerSuccess: true });
    } catch (error) {
        console.error('Registration error:', error);
        res.render('register', { registerError: 'An error occurred during registration', registerSuccess: null });
    }
};


exports.postLogin = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ $or: [{ username }, { email: username }] });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.render('home', { loginError: 'Invalid username or password' });
        }

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

exports.getHome = (req, res) => {
    res.render('home');
};

exports.getAbout = (req, res) => {
    res.render('aboutus');
};

exports.getFAQ = (req, res) => {
    res.render('faq');
};

exports.getFeedback = (req, res) => {
    res.render('feedback');
};
