const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // thư mục lưu file
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

// Cho phép định dạng audio + video (mp3, wav, mp4)
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'audio/mpeg',   // mp3
    'audio/mp3',
    'audio/wav',
    'audio/x-wav',
    'audio/wave',
    'audio/x-pn-wav',
    'video/mp4','image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',     // mp4 video
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only audio (mp3, wav) and video (mp4) files are allowed.'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // Giới hạn 50MB (video thường to hơn)
});

module.exports = upload;
