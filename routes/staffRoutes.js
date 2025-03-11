const express = require("express");
const router = express.Router();
const { getAllStaffs } = require("../controllers/staffController");

router.get("/", getAllStaffs);

module.exports = router;
