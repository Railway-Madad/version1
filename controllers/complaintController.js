const { getComplaints, addComplaint } = require("../models/complaintModel");

const getAllComplaints = (req, res) => {
    res.json(getComplaints());
};

const createComplaint = (req, res) => {
    const newComplaint = req.body;
    addComplaint(newComplaint);
    res.status(201).json({ message: "Complaint registered", complaint: newComplaint });
};

module.exports = { getAllComplaints, createComplaint };
