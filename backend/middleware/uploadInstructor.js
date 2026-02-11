const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Tạo thư mục nếu chưa có
const uploadDir = 'uploads/instructors/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'instructor-' + uniqueSuffix + path.extname(file.originalname));
  },
});

// Chỉ cho phép ảnh
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images (jpg, png, gif, webp) are allowed.'));
  }
};

const uploadInstructor = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB cho ảnh
});

module.exports = uploadInstructor;