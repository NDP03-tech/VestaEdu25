const Instructor = require("../models/Instructor");
const { Op } = require("sequelize");

// @desc    Get all instructors
// @route   GET /api/instructors
// @access  Public
exports.getAllInstructors = async (req, res) => {
  try {
    const { page = 1, limit = 8, status, search } = req.query;

    const offset = (page - 1) * limit;
    const where = {};

    if (status) {
      where.status = status;
    }

    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { designation: { [Op.like]: `%${search}%` } },
      ];
    }

    const { count, rows } = await Instructor.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["created_at", "DESC"]],
    });

    res.status(200).json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Get single instructor
// @route   GET /api/instructors/:id
// @access  Public
exports.getInstructor = async (req, res) => {
  try {
    const instructor = await Instructor.findByPk(req.params.id);

    if (!instructor) {
      return res.status(404).json({
        success: false,
        message: "Instructor not found",
      });
    }

    res.status(200).json({
      success: true,
      data: instructor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Create new instructor
// @route   POST /api/instructors
// @access  Private/Admin
exports.createInstructor = async (req, res) => {
  try {
    const {
      name,
      designation,
      bio,
      image,
      facebook,
      twitter,
      linkedin,
      email,
      phone,
      status,
    } = req.body;

    // Validate required fields
    if (!name || !designation) {
      return res.status(400).json({
        success: false,
        message: "Please provide name and designation",
      });
    }

    const instructor = await Instructor.create({
      name,
      designation,
      bio,
      image: req.file ? req.file.filename : image,
      facebook,
      twitter,
      linkedin,
      email,
      phone,
      status,
    });

    res.status(201).json({
      success: true,
      data: instructor,
      message: "Instructor created successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Update instructor
// @route   PUT /api/instructors/:id
// @access  Private/Admin
exports.updateInstructor = async (req, res) => {
  try {
    const instructor = await Instructor.findByPk(req.params.id);

    if (!instructor) {
      return res.status(404).json({
        success: false,
        message: "Instructor not found",
      });
    }

    const updateData = { ...req.body };

    if (req.file) {
      updateData.image = req.file.filename;
    }

    await instructor.update(updateData);

    res.status(200).json({
      success: true,
      data: instructor,
      message: "Instructor updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Delete instructor
// @route   DELETE /api/instructors/:id
// @access  Private/Admin
exports.deleteInstructor = async (req, res) => {
  try {
    const instructor = await Instructor.findByPk(req.params.id);

    if (!instructor) {
      return res.status(404).json({
        success: false,
        message: "Instructor not found",
      });
    }

    await instructor.destroy();

    res.status(200).json({
      success: true,
      message: "Instructor deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Bulk create instructors
// @route   POST /api/instructors/bulk
// @access  Private/Admin
exports.bulkCreateInstructors = async (req, res) => {
  try {
    const instructors = await Instructor.bulkCreate(req.body.instructors, {
      validate: true,
    });

    res.status(201).json({
      success: true,
      data: instructors,
      message: `${instructors.length} instructors created successfully`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
