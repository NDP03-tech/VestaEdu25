const cloudinary = require('cloudinary').v2;

// Cấu hình Cloudinary (lấy từ Dashboard Cloudinary)
cloudinary.config({
  cloud_name: 'dubzoozqi',
  api_key: '364771119671548',
  api_secret: '8lmU9raEEqiHgl6jc4sG4lreGs8',
});

module.exports = cloudinary;
