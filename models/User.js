const fs = require('fs');
const path = require('path');

const USERS_FILE = path.join(__dirname, '../data/users.json');

// Ensure users.json exists
if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([]));
}

class User {
    static getAll() {
        return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
    }

    static findByUsernameOrEmail(identifier) {
        const users = this.getAll();
        return users.find(u => u.username === identifier || u.email === identifier);
    }

    static create(userData) {
        const users = this.getAll();
        const newUser = {
            id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
            ...userData,
            createdAt: new Date().toISOString()
        };
        users.push(newUser);
        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
        return newUser;
    }
}

module.exports = User;