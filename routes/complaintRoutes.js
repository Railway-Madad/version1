const express = require("express");
const router = express.Router();
const { getAllComplaints, createComplaint } = require("../controllers/complaintController");

router.get("/", getAllComplaints);
router.post("/", createComplaint);

module.exports = router;
