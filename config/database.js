const sqlite3 = require('sqlite3').verbose();

const connectDB = () => {
    const db = new sqlite3.Database(':memory:', (err) => {
        if (err) {
            console.error('Error opening database:', err.message);
            return;
        }
        console.log('Connected to SQLite in-memory database.');

        // Create users table
        db.run(
            `CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL,
                password TEXT NOT NULL
            )`,
            (err) => {
                if (err) {
                    console.error('Error creating table:', err.message);
                    return;
                }
                console.log('Users table created.');

                // Insert hardcoded admin users
                db.run(
                    `INSERT OR IGNORE INTO users (username, password) VALUES 
                    ('admin1@gmail.com', 'adminpass123'), 
                    ('admin2@gmail.com', 'secureAdmin456')`,
                    (err) => {
                        if (err) {
                            console.error('Error inserting users:', err.message);
                        } else {
                            console.log('Admin users inserted.');
                        }
                    }
                );
            }
        );
    });
    return db;
};

module.exports = { connectDB };