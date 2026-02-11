const express = require("express");
const router = express.Router();
const {
  getAllInstructors,
  getInstructor,
  createInstructor,
  updateInstructor,
  deleteInstructor,
  bulkCreateInstructors,
} = require("../controllers/instructorController");

// Import upload mới
const uploadInstructor = require("../middleware/uploadInstructor");

// Public routes
router.get("/", getAllInstructors);
router.get("/:id", getInstructor);

// Admin routes
router.post("/", uploadInstructor.single("image"), createInstructor);
router.put("/:id", uploadInstructor.single("image"), updateInstructor);
router.delete("/:id", deleteInstructor);
router.post("/bulk", bulkCreateInstructors);

module.exports = router;
