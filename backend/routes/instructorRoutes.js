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
const authenticateToken = require("../middleware/authenticateToken");
const authorizeRoles = require("../middleware/authorizeRoles");

// Public routes
router.get("/", getAllInstructors);
router.get("/:id", getInstructor);

// Admin routes
router.post(
  "/",
  authenticateToken,
  authorizeRoles("admin"),
  uploadInstructor.single("image"),
  createInstructor,
);
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  uploadInstructor.single("image"),
  updateInstructor,
);
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  deleteInstructor,
);
router.post(
  "/bulk",
  authenticateToken,
  authorizeRoles("admin"),
  bulkCreateInstructors,
);

module.exports = router;
