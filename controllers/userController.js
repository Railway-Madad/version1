const { getUsers, registerUser } = require("../models/userModel");
const { verifyPassword, generateToken } = require("../services/authService");

// Register new user
const register = async (req, res) => {
    try {
        const newUser = await registerUser(req.body);
        res.status(201).json({ message: "User registered successfully", newUser });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Login user
const login = async (req, res) => {
    const { username, password } = req.body;
    const users = getUsers();
    
    const user = users.find((u) => u.username === username);
    
    if (!user) {
        return res.status(401).json({ message: "Invalid username or password" });
    }

    const isPasswordValid = await verifyPassword(password, user.password);
    
    if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = generateToken(user);
    res.json({ message: "Login successful", token });
};

module.exports = { register, login };
