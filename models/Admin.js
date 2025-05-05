const { connectDB } = require('../config/database');

class Admin {
    static async authenticate(username, password) {
        const db = connectDB();
        return new Promise((resolve, reject) => {
            db.get(
                `SELECT * FROM users WHERE username = ? AND password = ?`,
                [username, password],
                (err, row) => {
                    if (err) reject(err);
                    resolve(!!row);
                }
            );
        });
    }
}

module.exports = Admin;