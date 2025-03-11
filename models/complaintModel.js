const fs = require("fs");
const path = require("path");

const complaintFile = path.join(__dirname, "../data/complaint.json");

const getComplaints = () => {
    const data = fs.readFileSync(complaintFile);
    return JSON.parse(data);
};

const addComplaint = (complaint) => {
    const complaints = getComplaints();
    complaints.push(complaint);
    fs.writeFileSync(complaintFile, JSON.stringify(complaints, null, 2));
};

module.exports = { getComplaints, addComplaint };
