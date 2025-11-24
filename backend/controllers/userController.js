const User = require('../models/User');
const jwt = require('jsonwebtoken');
const Class = require('../models/Class');
const Quiz = require('../models/Quiz');
const UserQuizResult = require('../models/UserQuizResult');
const bcrypt = require('bcryptjs');

// Đăng nhập
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '4h' });

        res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Đăng ký
const register = async (req, res) => {
    const { email, password, role } = req.body;
    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) return res.status(400).json({ message: 'Email already exists' });

        const user = await User.create({ email, password, role });
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Lấy tất cả người dùng
const getUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
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
        address
    } = req.body;

    try {
        const exists = await User.findOne({ where: { email } });
        if (exists) return res.status(400).json({ message: 'Email already exists' });

        const user = await User.create({
            email,
            password,
            role,
            firstName,
            lastName,
            studentPhone,
            guardianPhone,
            studentEmail,
            guardianEmail,
            address
        });

        res.status(201).json({ message: 'User added successfully', user });
    } catch (error) {
        console.error('Error in addUser:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
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
        if (!user) return res.status(404).json({ message: 'User not found' });

        await user.update(updatedData);

        res.json({ message: 'User updated successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Xóa người dùng
const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        await user.destroy();
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Tạo tài khoản admin
const createAdmin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const adminUser = await User.create({ email, password, role: 'admin' });
        res.status(201).json({ message: 'Admin created', user: adminUser });
    } catch (error) {
        res.status(400).json({ message: 'Error creating admin' });
    }
};

// Lấy quiz cho user cụ thể
const getQuizzesForUser = async (req, res) => {
    try {
        const { userId } = req.params;

        // Find all classes where this user is a student (using the join table)
        const user = await User.findByPk(userId, {
            include: [{
                model: Class,
                as: 'classes',
                attributes: ['id'],
                through: { attributes: [] }
            }]
        });
        const classIds = user && user.classes ? user.classes.map(cls => cls.id) : [];

        // Find all quizzes associated with these classes (using the join table)
        let quizzes = [];
        if (classIds.length > 0) {
            quizzes = await Quiz.findAll({
                include: [{
                    model: Class,
                    as: 'classes',
                    where: { id: classIds },
                    attributes: [],
                    through: { attributes: [] }
                }]
            });
        }

        // For each quiz, check the highest result for the student
        const { Op } = require('sequelize');
        let results = [];
        if (quizzes.length > 0) {
            results = await UserQuizResult.findAll({
                where: {
                    user_id: userId,
                    quiz_id: quizzes.map(q => q.id),
                    submittedAt: { [Op.ne]: null }
                }
            });
        }

        const resultMap = {};
        results.forEach(result => {
            resultMap[result.quizId] = result.passed;
        });

        const quizzesWithStatus = quizzes.map(q => ({
            ...q.toJSON(),
            passed: resultMap[q.id] || false
        }));

        res.json(Array.isArray(quizzesWithStatus) ? quizzesWithStatus : []);
    } catch (error) {
        console.error('Error fetching quizzes for user:', error);
        res.status(500).json({ message: 'Lỗi khi lấy quiz cho học sinh', error });
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
};
