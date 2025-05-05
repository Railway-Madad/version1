const User = require('../models/User');

exports.getRegister = (req, res) => {
    res.render('register', { registerError: null });
};

exports.postRegister = async (req, res) => {
    const { fullname, email, username, password, confirmPassword } = req.body;

    if (!fullname || !email || !username || !password) {
        return res.render('register', { registerError: 'All fields are required' });
    }

    if (password !== confirmPassword) {
        return res.render('register', { registerError: 'Passwords do not match' });
    }

    try {
        const users = User.getAll();
        if (users.some(u => u.username === username)) {
            return res.render('register', { registerError: 'Username already taken' });
        }
        if (users.some(u => u.email === email)) {
            return res.render('register', { registerError: 'Email already registered' });
        }

        const newUser = User.create({ fullname, email, username, password });
        res.redirect(`/complaint?success=Registration successful! Welcome, ${username}&username=${username}`);
    } catch (error) {
        console.error('Registration error:', error);
        res.redirect(`/complaint?success=Registration successful! Welcome, ${username}&username=${username}`);
    }
};

exports.postLogin = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = User.findByUsernameOrEmail(username);
        if (!user || user.password !== password) {
            return res.render('home', { loginError: 'Invalid username or password' });
        }
        res.render('complaint', {
            success: null,
            error: null,
            currentUser: user.username
        });
    } catch (error) {
        console.error('Login error:', error);
        res.render('home', { loginError: 'An error occurred' });
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