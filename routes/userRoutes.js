const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/userController");
const { authenticateToken } = require("../services/authService");

router.post("/register", register);
router.post("/login", login);
router.get("/profile", authenticateToken, (req, res) => {
    res.json({ message: "Protected user profile", user: req.user });
});

module.exports = router;
