const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    domain: {
        type: String,
        required: true, // e.g., "admin", "ticketing", "cleaning", etc.
        enum: ["admin", "ticketing", "cleaning", "security", "maintenance"],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model("Staff", staffSchema);
