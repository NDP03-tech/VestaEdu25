const multer = require("multer");
const storage = multer.memoryStorage();

// Chỉ cho phép ảnh
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only images (jpg, png, gif, webp) are allowed.",
      ),
    );
  }
};

const uploadInstructor = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB cho ảnh
});

module.exports = uploadInstructor;
