const fs = require("fs");
const path = require("path");

const staffFile = path.join(__dirname, "../data/staff.json");

const getStaffs = () => {
    const data = fs.readFileSync(staffFile);
    return JSON.parse(data);
};

module.exports = { getStaffs };
