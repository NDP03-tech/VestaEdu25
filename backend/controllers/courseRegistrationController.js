const CourseRegistration = require("../models/CourseRegistration");
const { Resend } = require("resend");

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

// POST: Người dùng đăng ký
exports.registerCourse = async (req, res) => {
  try {
    const { name, email, phone, courseId, courseTitle } = req.body;
    console.log("📦 req.body:", req.body);
    if (!name || !email || !phone || !courseId || !courseTitle) {
      return res
        .status(400)
        .json({ message: "Vui lòng điền đầy đủ thông tin" });
    }

    const registration = new CourseRegistration({
      name,
      email,
      phone,
      courseId,
      courseTitle,
    });
    await registration.save();

    if (resend)
      await resend.emails.send({
        from: "onboarding@resend.dev",
        to: "vestaacademyvn@gmail.com", // ✅ Đã thay đổi
        subject: `🔔 Đăng ký mới: ${courseTitle}`,
        html: `<p><b>${name}</b> vừa đăng ký khóa học <b>${courseTitle}</b>.</p>
             <p>Email: ${email}</p>
             <p>Điện thoại: ${phone}</p>`,
      });

    res.status(201).json({ message: "Đăng ký thành công" });
  } catch (error) {
    console.error("Lỗi khi đăng ký:", error);
    res.status(500).json({ message: "Lỗi server khi đăng ký khóa học" });
  }
};

// GET: Admin lấy danh sách đăng ký
exports.getAllRegistrations = async (req, res) => {
  try {
    const registrations = await CourseRegistration.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: "Không thể lấy danh sách đăng ký" });
  }
};
