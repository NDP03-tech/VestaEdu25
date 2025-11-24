// controllers/eventRegistrationController.js
const EventRegistration = require('../models/EventRegistration');
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY); // Đảm bảo bạn đã đưa key vào .env

// POST: Người dùng đăng ký sự kiện
exports.registerEvent = async (req, res) => {
  try {
    const { name, email, phone, eventId, eventTitle } = req.body;

    if (!name || !email || !phone || !eventId || !eventTitle) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin' });
    }

    const existing = await EventRegistration.findOne({ where: { email, eventId } });
    if (existing) {
      return res.status(409).json({ message: 'Bạn đã đăng ký sự kiện này rồi' });
    }

    const registration = await EventRegistration.create({ name, email, phone, eventId, eventTitle });

    // Gửi email cho admin
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'nguyendacphuc2112003@gmail.com',
      subject: `🎉 Đăng ký sự kiện mới: ${eventTitle}`,
      html: `<p><b>${name}</b> vừa đăng ký sự kiện <b>${eventTitle}</b>.</p>
             <p>Email: ${email}</p>
             <p>Điện thoại: ${phone}</p>`
    });

    // Gửi email xác nhận cho người dùng
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: `Xác nhận đăng ký sự kiện: ${eventTitle}`,
      html: `<p>Chào <b>${name}</b>,</p>
             <p>Bạn đã đăng ký thành công sự kiện <b>${eventTitle}</b>.</p>
             <p>Chúng tôi sẽ sớm liên hệ với bạn nếu cần thêm thông tin.</p>`
    });

    res.status(201).json({ message: 'Đăng ký sự kiện thành công' });
  } catch (error) {
    console.error('Lỗi khi đăng ký sự kiện:', error);
    res.status(500).json({ message: 'Lỗi server khi đăng ký sự kiện' });
  }
};

// GET: Admin lấy danh sách đăng ký
exports.getAllEventRegistrations = async (req, res) => {
  try {
    const registrations = await EventRegistration.findAll({ order: [['createdAt', 'DESC']] });
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: 'Không thể lấy danh sách đăng ký sự kiện' });
  }
};
