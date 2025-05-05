const fs = require('fs');
const path = require('path');

const COMPLAINTS_FILE = path.join(__dirname, '../data/complaints.json');

// Ensure complaints.json exists
if (!fs.existsSync(COMPLAINTS_FILE)) {
    fs.writeFileSync(COMPLAINTS_FILE, JSON.stringify([]));
}

class Complaint {
    static getAll() {
        return JSON.parse(fs.readFileSync(COMPLAINTS_FILE, 'utf8'));
    }

    static findById(id) {
        const complaints = this.getAll();
        return complaints.find(c => c.id === id);
    }

    static findByUsername(username) {
        const complaints = this.getAll();
        return complaints.filter(c => c.username === username);
    }

    static create(complaintData) {
        const complaints = this.getAll();
        const newComplaint = {
            id: Date.now().toString(),
            ...complaintData,
            status: 'Pending',
            createdAt: new Date().toISOString()
        };
        complaints.push(newComplaint);
        fs.writeFileSync(COMPLAINTS_FILE, JSON.stringify(complaints, null, 2));
        return newComplaint;
    }

    static update(id, updateData) {
        const complaints = this.getAll();
        const complaintIndex = complaints.findIndex(c => c.id === id);
        if (complaintIndex === -1) return null;
        complaints[complaintIndex] = { ...complaints[complaintIndex], ...updateData };
        fs.writeFileSync(COMPLAINTS_FILE, JSON.stringify(complaints, null, 2));
        return complaints[complaintIndex];
    }
}

module.exports = Complaint;