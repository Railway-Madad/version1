const ImageDescription = require('../models/NewsModel');

// POST: Upload image and description
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Image is required' });

    const newEntry = new ImageDescription({
      image_url: `/uploads/${req.file.filename}`,
      description: req.body.description,
    });

    await newEntry.save();
    res.status(201).json({ message: 'Image and description saved successfully', data: newEntry });
  } catch (err) {
    res.status(500).json({ message: 'Error uploading image', error: err.message });
  }
};

// GET: Top 5 latest posts
exports.getLatestNews = async (req, res) => {
  try {
    const topFive = await ImageDescription.find()
      .sort({ created_at: -1 })
      .limit(5);
    res.status(200).json(topFive);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching latest news', error: err.message });
  }
};