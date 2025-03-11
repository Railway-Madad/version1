const fs = require("fs");
const path = require("path");
const { hashPassword } = require("../services/authService");

const userFilePath = path.join(__dirname, "../data/user.json");

// Read users from JSON file
const getUsers = () => {
    return JSON.parse(fs.readFileSync(userFilePath, "utf-8"));
};

// Save users to JSON file
const saveUsers = (users) => {
    fs.writeFileSync(userFilePath, JSON.stringify(users, null, 2));
};

// Register a new user (hashing password before storing)
const registerUser = async (userData) => {
    const users = getUsers();
    const existingUser = users.find((u) => u.username === userData.username);
    
    if (existingUser) {
        throw new Error("Username already exists");
    }

    // Hash password before storing
    userData.password = await hashPassword(userData.password);
    users.push(userData);
    saveUsers(users);
    return userData;
};

module.exports = { getUsers, registerUser };
