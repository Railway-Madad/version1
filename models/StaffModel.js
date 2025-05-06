
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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

staffSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

staffSchema.methods.comparePassword = function(password) {
    return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('Staff', staffSchema);

