const Course = require('../models/Course');
const path = require('path');

// Tạo khóa học (upload ảnh lên thư mục local)
exports.createCourse = async (req, res) => {
  try {
    const {
      name,
      title,
      dis,
      author,
      language,
      lesson,
      price,
      duration,
      type,
      schedule,
      content,
    } = req.body;

    // Nếu schedule là chuỗi (do FormData không hỗ trợ arrays), bạn cần split:
    const scheduleArr = typeof schedule === 'string' ? schedule.split(',').map(s => s.trim()) : [];

    // Giả sử bạn lưu link ảnh dưới dạng URL (string), đã được frontend xử lý upload riêng và gửi kèm
    const image = req.body.image || null;
    const bannerImg = req.body.bannerImg || null;
    const authorImg = req.body.authorImg || null;

    const newCourse = await Course.create({
      name,
      title,
      dis,
      author,
      language,
      lesson,
      price,
      duration,
      type,
      schedule: scheduleArr,
      content,
      image,
      bannerImg,
      authorImg,
    });
    res.status(201).json({ message: 'Course created', course: newCourse });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create course' });
  }
};

  

// Lấy khóa học theo _id
exports.getCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findByPk(id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json(course);
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ message: 'Error fetching course', error });
  }
};

// Lấy tất cả khóa học
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.findAll();
    res.status(200).json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Error fetching courses', error });
  }
};

// Cập nhật khóa học
exports.updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    // Xử lý ảnh nếu có upload mới
    if (req.files) {
      if (req.files.image?.[0]) {
        updatedData.image = `/uploads/${req.files.image[0].filename}`;
      }
      if (req.files.bannerImg?.[0]) {
        updatedData.bannerImg = `/uploads/${req.files.bannerImg[0].filename}`;
      }
      if (req.files.authorImg?.[0]) {
        updatedData.authorImg = `/uploads/${req.files.authorImg[0].filename}`;
      }
    }

    const course = await Course.findByPk(id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const updatedCourse = await course.update(updatedData);
    if (!updatedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json({ message: 'Course updated successfully', updatedCourse });
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(400).json({ message: 'Error updating course', error });
  }
};

// Xóa khóa học
exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findByPk(id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const deletedCourse = await course.destroy();
    if (!deletedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json({ message: 'Course deleted successfully', deletedCourse });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ message: 'Error deleting course', error });
  }
};
