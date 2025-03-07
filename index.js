// index.js
const express = require("express");
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(express.json());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Global complaints data
let complaintsData = [];

// File path for storing complaints
const complaintsFile = path.join(__dirname, 'complaints.json');

// Ensure complaints.json exists
if (!fs.existsSync(complaintsFile)) {
    fs.writeFileSync(complaintsFile, JSON.stringify([]));
}

// Routes
app.get("/", (req, res) => {
    res.render("home");
});

app.get("/complaint", (req, res) => {
    
    res.render("complaint", {
        success: req.query.success,
        error: req.query.error
    });
});

app.post('/submit-complaint', (req, res) => {
    try {
        const complaintsData = fs.readFileSync(complaintsFile);
        const complaints = JSON.parse(complaintsData);

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

        res.redirect('/complaint?success=true');
    } catch (error) {
        console.error(error);
        res.redirect('/complaint?error=true');
    }
});


// Render dashboard with paginated complaints
app.get("/staff-dashboard", (req, res) => {
    // Load complaints data from complaint.json
fs.readFile("complaints.json", "utf8", (err, data) => {
    if (err) {
      console.error("Error reading the file:", err);
      return;
    }
  
    try {
      complaintsData = JSON.parse(data);
      console.log("Complaints data loaded successfully.");
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
    }
  });

  
  const page = parseInt(req.query.page) || 1;
  const itemsPerPage = 5;
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedComplaints = complaintsData.slice(startIndex, endIndex);
  const totalPages = Math.ceil(complaintsData.length / itemsPerPage);

  res.render("staff_dashboard.ejs", {
    staffName: "Railway Staff",
    complaints: paginatedComplaints,
    currentPage: page,
    totalPages: totalPages
  });
});

// API to get a specific complaint
app.get("/api/complaints/:id", (req, res) => {
  const complaint = complaintsData.find(c => c.id === req.params.id);
  complaint ? res.json(complaint) : res.status(404).json({ error: "Complaint not found" });
});
  

app.put("/api/complaints/:id/resolve", (req, res) => {
    const complaintIndex = complaintsData.findIndex(c => c.id === req.params.id);
    
    if (complaintIndex !== -1) {
      const { resolutionDetails, resolutionCategory } = req.body;
      if (!resolutionDetails || !resolutionCategory) {
        return res.status(400).json({ error: "Missing resolution details or category" });
      }
  
      // Update the complaint object
      complaintsData[complaintIndex].status = "Resolved";
      complaintsData[complaintIndex].resolutionDetails = resolutionDetails;
      complaintsData[complaintIndex].resolutionCategory = resolutionCategory;
      complaintsData[complaintIndex].resolvedAt = new Date().toISOString();
  
      // Write the updated complaintsData back to the JSON file
      fs.writeFile("complaints.json", JSON.stringify(complaintsData, null, 2), (err) => {
        if (err) {
          console.error("Error updating complaint.json:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }
        res.json(complaintsData[complaintIndex]);
      });
  
    } else {
      res.status(404).json({ error: "Complaint not found" });
    }
  });
  
app.listen(3000, () => {
    console.log("Port running at 3000");
});