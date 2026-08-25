const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const authenticateToken = require("../middleware/authenticateToken");
const authorizeRoles = require("../middleware/authorizeRoles");
const uploadToCloudinary = require("../utils/uploadToCloudinary");

// POST /api/upload-media
router.post(
  "/upload-media",
  authenticateToken,
  authorizeRoles("admin", "teacher"),
  upload.single("file"),
  async (req, res, next) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    try {
      const result = await uploadToCloudinary(req.file.buffer, "vestaedu");
      res.json({
        success: true,
        data: { fileUrl: result.secure_url, filename: result.public_id },
      });
    } catch (error) {
      next(error);
    }
  },
);

module.exports = router;
