const User = require("../models/User");
const jwt = require("jsonwebtoken");
const Class = require("../models/Class");
const Quiz = require("../models/Quiz");
const UserQuizResult = require("../models/UserQuizResult");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const RefreshToken = require("../models/RefreshToken");
const {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  cookieOptions,
  hashToken,
  getCookie,
  clearAuthCookies,
} = require("../utils/authCookies");

const accessTokenAge = 15 * 60 * 1000;
const refreshTokenAge = 30 * 24 * 60 * 60 * 1000;

const publicUser = (user) => ({
  id: user.id,
  email: user.email,
  role: user.role,
  firstName: user.firstName,
  lastName: user.lastName,
});

const issueTokens = async (user, res) => {
  const accessToken = jwt.sign(
    { id: user.id, role: user.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" },
  );
  const refreshToken = crypto.randomBytes(64).toString("hex");
  await RefreshToken.create({
    userId: user.id,
    tokenHash: hashToken(refreshToken),
    expiresAt: new Date(Date.now() + refreshTokenAge),
  });
  res.cookie(ACCESS_COOKIE, accessToken, cookieOptions(accessTokenAge));
  res.cookie(REFRESH_COOKIE, refreshToken, cookieOptions(refreshTokenAge));
  return { accessToken, user: publicUser(user) };
};

// Đăng nhập
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Mật khẩu không đúng" });
    }

    res.json(await issueTokens(user, res));
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Đăng ký
const register = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser)
      return res.status(400).json({ message: "Email đã tồn tại" });

    await User.create({ email, password, role: "student" });
    res.status(201).json({ message: "Người dùng đã được tạo thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

// Lấy tất cả người dùng
const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const safePage = Math.max(Number.parseInt(page, 10) || 1, 1);
    const safeLimit = Math.min(
      Math.max(Number.parseInt(limit, 10) || 20, 1),
      100,
    );
    const where = search
      ? { email: { [require("sequelize").Op.like]: `%${search}%` } }
      : undefined;
    const { count, rows } = await User.findAndCountAll({
      where,
      attributes: { exclude: ["password"] },
      limit: safeLimit,
      offset: (safePage - 1) * safeLimit,
      order: [["createdAt", "DESC"]],
    });
    res.json({
      success: true,
      data: rows,
      meta: {
        page: safePage,
        limit: safeLimit,
        total: count,
        totalPages: Math.ceil(count / safeLimit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

// Thêm người dùng
const addUser = async (req, res) => {
  const {
    email,
    password,
    role,
    firstName,
    lastName,
    studentPhone,
    guardianPhone,
    studentEmail,
    guardianEmail,
    address,
  } = req.body;

  try {
    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(400).json({ message: "Email đã tồn tại" });

    const user = await User.create({
      email,
      password,
      role: ["admin", "teacher", "student"].includes(role) ? role : "student",
      firstName,
      lastName,
      studentPhone,
      guardianPhone,
      studentEmail,
      guardianEmail,
      address,
    });

    res.status(201).json({
      message: "Người dùng đã được thêm thành công",
      user: publicUser(user),
    });
  } catch (error) {
    console.error("Error in addUser:", error);
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};

// Cập nhật người dùng
const updateUser = async (req, res) => {
  const { id } = req.params;
  let updatedData = { ...req.body };

  try {
    // Nếu password không được gửi hoặc là chuỗi rỗng thì không cập nhật
    if (!updatedData.password || updatedData.password.trim() === "") {
      delete updatedData.password;
    }
    // Sequelize sẽ tự động hash password trong hook beforeUpdate

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.update(updatedData);

    res.json({ message: "User updated successfully", user: publicUser(user) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Xóa người dùng
const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.destroy();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Tạo tài khoản admin
const createAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const adminUser = await User.create({ email, password, role: "admin" });
    res
      .status(201)
      .json({ message: "Admin created", user: publicUser(adminUser) });
  } catch (error) {
    res.status(400).json({ message: "Error creating admin" });
  }
};

const refresh = async (req, res) => {
  const rawToken = getCookie(req, REFRESH_COOKIE) || req.body.refreshToken;
  if (!rawToken)
    return res
      .status(401)
      .json({ message: "Refresh token không được cung cấp." });

  const storedToken = await RefreshToken.findOne({
    where: { tokenHash: hashToken(rawToken), revokedAt: null },
    include: [{ model: User, as: "user" }],
  });
  if (!storedToken || storedToken.expiresAt <= new Date()) {
    clearAuthCookies(res);
    return res
      .status(401)
      .json({ message: "Refresh token không hợp lệ hoặc đã hết hạn." });
  }

  storedToken.revokedAt = new Date();
  await storedToken.save();
  res.json(await issueTokens(storedToken.user, res));
};

const logout = async (req, res) => {
  const rawToken = getCookie(req, REFRESH_COOKIE) || req.body.refreshToken;
  if (rawToken)
    await RefreshToken.update(
      { revokedAt: new Date() },
      { where: { tokenHash: hashToken(rawToken), revokedAt: null } },
    );
  clearAuthCookies(res);
  res.status(204).send();
};

const me = async (req, res) => {
  const user = await User.findByPk(req.user.id, {
    attributes: { exclude: ["password"] },
  });
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ success: true, data: publicUser(user) });
};

// Lấy quiz cho user cụ thể
const getQuizzesForUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find all classes where this user is a student (using the join table)
    const user = await User.findByPk(userId, {
      include: [
        {
          model: Class,
          as: "classes",
          attributes: ["id"],
          through: { attributes: [] },
        },
      ],
    });
    const classIds =
      user && user.classes ? user.classes.map((cls) => cls.id) : [];

    // Find all quizzes associated with these classes (using the join table)
    let quizzes = [];
    if (classIds.length > 0) {
      quizzes = await Quiz.findAll({
        include: [
          {
            model: Class,
            as: "classes",
            where: { id: classIds },
            attributes: [],
            through: { attributes: [] },
          },
        ],
      });
    }

    // For each quiz, check the highest result for the student
    const { Op } = require("sequelize");
    let results = [];
    if (quizzes.length > 0) {
      results = await UserQuizResult.findAll({
        where: {
          user_id: userId,
          quiz_id: quizzes.map((q) => q.id),
          submittedAt: { [Op.ne]: null },
        },
      });
    }

    const resultMap = {};
    results.forEach((result) => {
      resultMap[result.quizId] = result.passed;
    });

    const quizzesWithStatus = quizzes.map((q) => ({
      ...q.toJSON(),
      passed: resultMap[q.id] || false,
    }));

    res.json(Array.isArray(quizzesWithStatus) ? quizzesWithStatus : []);
  } catch (error) {
    console.error("Error fetching quizzes for user:", error);
    res.status(500).json({ message: "Lỗi khi lấy quiz cho học sinh", error });
  }
};

module.exports = {
  login,
  register,
  createAdmin,
  getUsers,
  addUser,
  updateUser,
  deleteUser,
  getQuizzesForUser,
  refresh,
  logout,
  me,
};
