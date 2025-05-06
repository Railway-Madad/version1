const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
    cloud_name: 'dmbvazgkw',
    api_key: '515686365244975',
    api_secret: 'Q0CVE7ECsPlV8y3PZGPp8ohN4bI' 
});

// Verify Cloudinary configuration
console.log('Cloudinary config:', cloudinary.config());

module.exports = {cloudinary};