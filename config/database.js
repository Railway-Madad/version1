const mongoose = require('mongoose');



const dbURI = 'mongodb+srv://ydmalve:G5jZ5XDKo3aKjIph@cluster0.8bita43.mongodb.net/RailMadad?retryWrites=true&w=majority'; 

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
