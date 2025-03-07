// index.js
const express = require("express");
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// File path for storing complaints
const complaintsFile = path.join(__dirname, 'complaints.json');

// Ensure complaints.json exists
if (!fs.existsSync(complaintsFile)) {
    fs.writeFileSync(complaintsFile, JSON.stringify([]));
}

// Routes
app.get("/", (req, res) => {
    res.render("home.ejs");
});

app.get("/complaint", (req, res) => {
    res.render("complaint.ejs");
});

app.post('/submit-complaint', (req, res) => {
    try {
        // Read existing complaints
        const complaintsData = fs.readFileSync(complaintsFile);
        const complaints = JSON.parse(complaintsData);

        // Create new complaint object
        const newComplaint = {
            username: req.body.username,
            pnr: req.body.pnr,
            description: req.body.description,
            issueDomain: req.body.issueDomain,
            createdAt: new Date().toISOString()
        };

        // Add new complaint and write back to file
        complaints.push(newComplaint);
        fs.writeFileSync(complaintsFile, JSON.stringify(complaints, null, 2));

        res.redirect('/complaint?success=true');
    } catch (error) {
        console.error(error);
        res.redirect('/complaint?error=true');
    }
});

app.listen(3000, () => {
    console.log("Port running at 3000");
});