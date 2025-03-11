const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET_KEY = "your_secret_key"; // Change this to a secure key

// Hash password
const hashPassword = async (password) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};

// Verify password
const verifyPassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

// Generate JWT token
const generateToken = (user) => {
    return jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: "1h" });
};

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const token = req.header("Authorization");
    
    if (!token) return res.status(401).json({ message: "Access denied, token missing" });

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ message: "Invalid token" });
    }
};

module.exports = { hashPassword, verifyPassword, generateToken, authenticateToken };
