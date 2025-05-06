const {cloudinary} = require('./config/cloudinary');

async function testUpload() {
    try {
        const result = await cloudinary.uploader.upload('E:/COLLEGE/RailMadad/version1/uploads/1746533928449-Q1.png', {
            folder: 'railmadad/complaints',
            public_id: `test_${Date.now()}`,
            resource_type: 'image'
        });
        console.log('Upload successful:', result.secure_url);
    } catch (error) {
        console.error('Upload failed:', error.message, error.stack);
    }
}

testUpload();