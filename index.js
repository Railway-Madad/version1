const express = require("express");
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();


app.use(express.json());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// File paths for storing data
const complaintsFile = path.join(__dirname, 'complaints.json');
const USERS_FILE = path.join(__dirname, 'users.json');

// Ensure `users.json` exists
if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([]));
}

// Ensure `complaints.json` exists
if (!fs.existsSync(complaintsFile)) {
    fs.writeFileSync(complaintsFile, JSON.stringify([]));
}

// Load complaints data into memory
let complaintsData = JSON.parse(fs.readFileSync(complaintsFile, 'utf8'));

// Routes

// Registration Page
app.get('/register', (req, res) => {
    res.render('register', { registerError: null });
});

app.get('/about' , (req,res)=>{
    res.render('aboutus.ejs');
}); 

app.get('/faq' , (req,res) =>{
    res.render("faq.ejs");
});

app.get('/feedback' , (req,res) => {
    res.render("feedback.ejs");
});

// Registration Logic (No bcrypt, stores password as-is)
app.post('/register', (req, res) => {
    const { fullname, email, username, password, confirmPassword } = req.body;

    if (!fullname || !email || !username || !password) {
        return res.render('register', { registerError: 'All fields are required' });
    }

    if (password !== confirmPassword) {
        return res.render('register', { registerError: 'Passwords do not match' });
    }

    try {
        let users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));

        if (users.some(u => u.username === username)) {
            return res.render('register', { registerError: 'Username already taken' });
        }

        if (users.some(u => u.email === email)) {
            return res.render('register', { registerError: 'Email already registered' });
        }

        const newUser = {
            id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
            fullname,
            email,
            username,
            password,  // Stored as plain text (not secure for production)
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

        // Redirect to /complaint with success message and username
        res.redirect(`/complaint?success=Registration successful! Welcome, ${username}&username=${username}`);
    } catch (error) {
        res.redirect(`/complaint?success=Registration successful! Welcome, ${username}&username=${username}`);
    }

});

// Login Logic
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    try {
        const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
        const user = users.find(u => u.username === username || u.email === username);

        if (!user || user.password !== password) {
            return res.render('home', { loginError: 'Invalid username or password' });
        }

        // Render complaint.ejs directly with the username
        res.render('complaint', {
            success: null,
            error: null,
            currentUser: user.username
        });
    } catch (error) {
        console.error('Login error:', error);
        res.render('home', { loginError: 'An error occurred' });
    }
});

// Home Route
app.get("/", (req, res) => {
    res.render("home");
});

// Complaint Form
app.get("/complaint", (req, res) => {
    res.render("complaint", {
        success: req.query.success,
        error: req.query.error,
        currentUser: req.query.username
    });
});

// Submit Complaint
app.post('/submit-complaint', (req, res) => {
    try {
        // Validate required fields
        if (!req.body.username || !req.body.pnr || !req.body.description || !req.body.issueDomain) {
            return res.redirect('/complaint?error=true&message=All fields are required');
        }

        const complaints = JSON.parse(fs.readFileSync(complaintsFile));

        const newComplaint = {
            id: Date.now().toString(),
            username: req.body.username,
            pnr: req.body.pnr,
            description: req.body.description,
            issueDomain: req.body.issueDomain,
            status: "Pending",
            createdAt: new Date().toISOString()
        };

        complaints.push(newComplaint);
        fs.writeFileSync(complaintsFile, JSON.stringify(complaints, null, 2));

        res.redirect(`/complaint?success=true&username=${req.body.username}`);
    } catch (error) {
        console.error('Error submitting complaint:', error);
        res.redirect('/complaint?error=true&message=Internal server error');
    }
});

// Staff Dashboard with Pagination
app.get("/staff-dashboard", (req, res) => {
    try {
        const complaints = JSON.parse(fs.readFileSync(complaintsFile));

        const page = parseInt(req.query.page) || 1;
        const itemsPerPage = 5;
        const startIndex = (page - 1) * itemsPerPage;
        const paginatedComplaints = complaints.slice(startIndex, startIndex + itemsPerPage);
        const totalPages = Math.ceil(complaints.length / itemsPerPage);

        res.render("staff_dashboard.ejs", {
            staffName: "Railway Staff",
            complaints: paginatedComplaints,
            currentPage: page,
            totalPages
        });
    } catch (error) {
        console.error("Error loading complaints:", error);
        res.render("staff_dashboard.ejs", { staffName: "Railway Staff", complaints: [], currentPage: 1, totalPages: 1 });
    }
});

// // API: Get Specific Complaint
app.get("/api/complaints/:id", (req, res) => {
    const complaints = JSON.parse(fs.readFileSync(complaintsFile));
     const complaint = complaints.find(c => c.id === req.params.id);
     complaint ? res.json(complaint) : res.status(404).json({ error: "Complaint not found" });
});

//new added for personal complaint
app.get("/api/complaints/user/:username", (req, res) => {
    try {
        const complaints = JSON.parse(fs.readFileSync(complaintsFile));
        const userComplaints = complaints.filter(c => c.username === req.params.username);
        res.json(userComplaints);
    } catch (error) {
        console.error("Error fetching complaints:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// API: Resolve Complaint
app.put("/api/complaints/:id/resolve", (req, res) => {
    try {
        let complaints = JSON.parse(fs.readFileSync(complaintsFile));
        const complaintIndex = complaints.findIndex(c => c.id === req.params.id);

        if (complaintIndex === -1) {
            return res.status(404).json({ error: "Complaint not found" });
        }

        const { resolutionDetails, resolutionCategory } = req.body;
        if (!resolutionDetails || !resolutionCategory) {
            return res.status(400).json({ error: "Missing resolution details or category" });
        }

        complaints[complaintIndex].status = "Resolved";
        complaints[complaintIndex].resolutionDetails = resolutionDetails;
        complaints[complaintIndex].resolutionCategory = resolutionCategory;
        complaints[complaintIndex].resolvedAt = new Date().toISOString();

        fs.writeFileSync(complaintsFile, JSON.stringify(complaints, null, 2));

        res.json(complaints[complaintIndex]);
    } catch (error) {
        console.error("Error resolving complaint:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Authentication function
const authenticateUser = (domain, username, password) => {
    try {
        const filePath = path.join(__dirname, `${domain}.json`); // Select correct JSON file
        const data = fs.readFileSync(filePath, 'utf8'); // Read JSON file
        const users = JSON.parse(data); // Parse JSON into JS object

        // Check if the username and password match
        return users.some(user => user.username === username && user.password === password);
    } catch (error) {
        console.error(`Error reading ${domain}.json:`, error);
        return false;
    }
};

const sqlite3 = require("sqlite3").verbose();   

const db = new sqlite3.Database(":memory:", (err) => {
    if (err) {
        console.error("Error opening database:", err.message);
    } else {
        console.log("Connected to SQLite in-memory database.");

        // Create users table
        db.run(
            `CREATE TABLE users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL,
                password TEXT NOT NULL
            )`,
            (err) => {
                if (err) {
                    console.error("Error creating table:", err.message);
                } else {
                    console.log("Users table created.");

                    // Insert two hardcoded admin users
                    db.run(
                        `INSERT INTO users (username, password) VALUES 
                        ('admin1@gmail.com', 'adminpass123'), 
                        ('admin2@gmail.com', 'secureAdmin456')`,
                        (err) => {
                            if (err) console.error("Error inserting users:", err.message);
                            else console.log("Admin users inserted.");
                        }
                    );
                }
            }
        );
    }
});

app.get('/admin', (req, res) => {     
    res.render('admin-login.ejs');
});

app.post('/admin-login', (req, res) => {  
    console.log("Request Body:", req.body); 

    const { domain, username, password } = req.body;

    console.log("Domain:", domain);
    console.log("Username:", username);

    if (domain === 'admin' || domain === 'staff') {
        let isAuthenticated = false;

        if (domain === 'admin') {
            
            db.get(
                `SELECT * FROM users WHERE username = ? AND password = ?`, 
                [username, password], 
                (err, row) => {
                    if (err) {
                        console.error("Database error:", err.message);
                        return res.send("Internal server error.");
                    }

                    isAuthenticated = !!row; 

                    if (isAuthenticated) {
                        // Fetch data for the dashboard
                        const complaints = JSON.parse(fs.readFileSync(complaintsFile, 'utf8'));
                        const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));

                        const totalComplaints = complaints.length;
                        const pendingComplaints = complaints.filter(c => c.status === 'Pending').length;
                        const resolvedComplaints = complaints.filter(c => c.status === 'Resolved').length;
                        const totalUsers = users.length;

                        res.render('admin-dashboard.ejs', {
                            totalComplaints,
                            pendingComplaints,
                            resolvedComplaints,
                            totalUsers,
                            complaints: complaints.slice(0, 5) 
                        });
                    } else {
                        res.send('Invalid username or password. Please try again.');
                    }
                }
            );
        } else {
            
            isAuthenticated = authenticateUser(domain, username, password);

            if (isAuthenticated) {
                res.redirect('/staff-dashboard');
            } else {
                res.send('Invalid username or password. Please try again.');
            }
        }
    } else {
        res.send('Invalid domain selection.');
    }
});


// Start Server
app.listen(3000, () => {
    console.log("Server running on port 3000");
});