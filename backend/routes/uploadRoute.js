const express = require('express');
const router = express.Router();


const upload = require('../middleware/upload');

// POST /api/upload-media
router.post('/upload-media', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  // Trả về URL file (giả sử server chạy ở localhost:5000)
  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

  res.json({
    message: 'File uploaded successfully',
    fileUrl,
    filename: req.file.filename,
  });
});

module.exports = router;
