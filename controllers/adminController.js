const { getAdmins } = require("../models/adminModel");

const adminLogin = (req, res) => {
    const { username, password } = req.body;
    const admins = getAdmins();
    
    const admin = admins.find((a) => a.username === username && a.password === password);
    
    if (admin) {
        res.json({ message: "Login successful", admin });
    } else {
        res.status(401).json({ message: "Invalid credentials" });
    }
};

module.exports = { adminLogin };
