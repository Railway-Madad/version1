const mongoose = require('mongoose');



const dbURI = 'mongodb+srv://ydmalve:yashdmalve5284@cluster0.ay0odnv.mongodb.net/'; 

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const connectDB = async () => {
  try {
    await mongoose.connect(dbURI, options);
    console.log("Successfully connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

module.exports = { connectDB };
