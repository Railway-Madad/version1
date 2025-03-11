const fs = require("fs");
const path = require("path");

const adminFile = path.join(__dirname, "../data/admin.json");

const getAdmins = () => {
    const data = fs.readFileSync(adminFile);
    return JSON.parse(data);
};

module.exports = { getAdmins };
