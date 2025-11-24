const Class = require("../models/Class");
const Quiz = require("../models/Quiz");
const User = require("../models/User");
const Question = require("../models/Question");
const { Op } = require("sequelize");

/**
 * Helper: ensure studentIds is an array of unique numbers
 */
function normalizeStudentIds(arr) {
  if (!Array.isArray(arr)) return [];
  return Array.from(new Set(arr.map((id) => Number(id))));
}

/**
 * CREATE class
 */
exports.createClass = async (req, res) => {
  try {
    const { name, description } = req.body;
    const newClass = await Class.create({ name, description });
    console.log("🟢 createClass:", newClass.id);
    return res.status(201).json(newClass);
  } catch (err) {
    console.error("❌ createClass error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET all classes
 */
exports.getAllClasses = async (req, res) => {
  try {
    const classes = await Class.findAll();
    return res.status(200).json(classes);
  } catch (err) {
    console.error("❌ getAllClasses error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET class by id
 */
exports.getClassById = async (req, res) => {
  try {
    const { classId, id } = req.params;
    const pk = classId || id;
    const classDoc = await Class.findByPk(pk);
    if (!classDoc) return res.status(404).json({ message: "Class not found" });
    return res.status(200).json(classDoc);
  } catch (err) {
    console.error("❌ getClassById error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * ✅ FIX: Add a single user to class using ASSOCIATION
 * POST /:classId/add-user
 * body: { userId }
 */
exports.addUserToClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId required" });
    }

    const classDoc = await Class.findByPk(classId);
    if (!classDoc) {
      return res.status(404).json({ message: "Class not found" });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Dùng association method
    await classDoc.addStudent(user);

    console.log(`✅ Added user ${userId} to class ${classId}`);
    return res.status(200).json({
      message: "User added to class successfully",
    });
  } catch (err) {
    console.error("❌ addUserToClass error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * ✅ FIX: Add multiple students to class using ASSOCIATION
 * POST /:classId/students
 * body: { studentIds: [1,2,3] }
 */
exports.addStudentsToClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const { studentIds } = req.body;

    if (!Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(400).json({ message: "studentIds required" });
    }

    const classDoc = await Class.findByPk(classId);
    if (!classDoc) {
      return res.status(404).json({ message: "Class not found" });
    }

    // ✅ Verify all users exist
    const users = await User.findAll({
      where: { id: studentIds }
    });

    if (users.length === 0) {
      return res.status(404).json({ message: "No valid users found" });
    }

    // ✅ Add students using association (will auto-handle duplicates)
    await classDoc.addStudents(users);

    console.log(`✅ Added ${users.length} students to class ${classId}`);
    
    return res.status(200).json({
      message: `Successfully added ${users.length} student(s)`,
      addedCount: users.length
    });

  } catch (err) {
    console.error("❌ addStudentsToClass error:", err);
    return res.status(500).json({ 
      message: "Server error", 
      error: err.message 
    });
  }
};

/**
 * ✅ FIX: Remove single student from class using ASSOCIATION
 * DELETE /:classId/students/:studentId
 */
exports.removeStudentFromClass = async (req, res) => {
  try {
    const { classId, studentId } = req.params;
    
    const classDoc = await Class.findByPk(classId);
    if (!classDoc) {
      return res.status(404).json({ message: "Class not found" });
    }

    const user = await User.findByPk(studentId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Remove using association
    await classDoc.removeStudent(user);

    console.log(`➖ Removed student ${studentId} from class ${classId}`);
    
    return res.status(200).json({ 
      message: "Student removed successfully" 
    });

  } catch (err) {
    console.error("❌ removeStudentFromClass error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * ✅ ALREADY CORRECT: Get students in class using ASSOCIATION
 * GET /:classId/students
 */
exports.getStudentsInClass = async (req, res) => {
  try {
    const { classId } = req.params;

    const classDoc = await Class.findByPk(classId, {
      include: [
        {
          model: User,
          as: "students",
          attributes: ["id", "firstName", "lastName", "email", "role", "studentPhone", "address"],
          through: { attributes: [] } // ✅ Don't include join table data
        },
      ],
    });

    if (!classDoc) {
      return res.status(404).json({ message: "Class not found" });
    }

    console.log(`✅ Found ${classDoc.students.length} students in class ${classId}`);

    return res.status(200).json(classDoc.students);

  } catch (err) {
    console.error("❌ getStudentsInClass error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * Add quiz to class using association
 * POST /:classId/add-quiz
 * body: { quizId }
 */
exports.addQuizToClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const { quizId } = req.body;
    
    if (!quizId) {
      return res.status(400).json({ message: "quizId required" });
    }

    const classDoc = await Class.findByPk(classId);
    if (!classDoc) {
      return res.status(404).json({ message: "Class not found" });
    }

    const quiz = await Quiz.findByPk(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // ✅ Use association
    await classDoc.addQuiz(quiz);
    
    console.log(`➕ Added quiz ${quizId} to class ${classId}`);
    
    return res.json({ message: "Quiz added to class successfully" });

  } catch (err) {
    console.error("❌ addQuizToClass error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * Get quizzes of a class
 * GET /:classId/quizzes
 */
exports.getQuizzesOfClass = async (req, res) => {
  try {
    const { classId } = req.params;
    
    const classDoc = await Class.findByPk(classId, {
      include: [
        {
          model: Quiz,
          as: "quizzes",
          through: { attributes: [] },
        },
      ],
    });

    if (!classDoc) {
      return res.status(404).json({ message: "Class not found" });
    }

    return res.json(classDoc.quizzes || []);

  } catch (err) {
    console.error("❌ getQuizzesOfClass error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * ✅ FIX: Move students between classes using ASSOCIATION
 * POST /move-students
 * body: { studentIds, fromClassId, toClassId }
 */
exports.moveStudents = async (req, res) => {
  try {
    const { studentIds, fromClassId, toClassId } = req.body;
    
    if (!Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(400).json({ message: "studentIds required" });
    }

    const fromClass = await Class.findByPk(fromClassId);
    const toClass = await Class.findByPk(toClassId);
    
    if (!fromClass || !toClass) {
      return res.status(404).json({ message: "From/To class not found" });
    }

    // ✅ Get users
    const users = await User.findAll({
      where: { id: studentIds }
    });

    if (users.length === 0) {
      return res.status(404).json({ message: "No valid users found" });
    }

    // ✅ Remove from source class
    await fromClass.removeStudents(users);
    
    // ✅ Add to target class
    await toClass.addStudents(users);

    console.log(`🔁 Moved ${users.length} students from class ${fromClassId} to ${toClassId}`);
    
    return res.json({ 
      message: `Successfully moved ${users.length} student(s)`,
      movedCount: users.length
    });

  } catch (err) {
    console.error("❌ moveStudents error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * Update class
 * PUT /:classId
 */
exports.updateClass = async (req, res) => {
  try {
    const { classId, id } = req.params;
    const pk = classId || id;
    const { name, description } = req.body;

    const classDoc = await Class.findByPk(pk);
    if (!classDoc) {
      return res.status(404).json({ message: "Class not found" });
    }

    await classDoc.update({ name, description });
    
    return res.json({ 
      message: "Class updated successfully", 
      class: classDoc 
    });

  } catch (err) {
    console.error("❌ updateClass error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * Delete class
 * DELETE /:classId
 */
exports.deleteClass = async (req, res) => {
  try {
    const { classId, id } = req.params;
    const pk = classId || id;
    
    const classDoc = await Class.findByPk(pk);
    if (!classDoc) {
      return res.status(404).json({ message: "Class not found" });
    }

    await classDoc.destroy();
    
    return res.json({ message: "Class deleted successfully" });

  } catch (err) {
    console.error("❌ deleteClass error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};