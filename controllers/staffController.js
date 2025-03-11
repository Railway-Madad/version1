const { getStaffs } = require("../models/staffModel");

const getAllStaffs = (req, res) => {
    res.json(getStaffs());
};

module.exports = { getAllStaffs };
