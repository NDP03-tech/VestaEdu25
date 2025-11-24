import React, { useState } from "react";
import emailjs from "emailjs-com";
import "./Form.css"; // Import file CSS

const RegisterForm = ({ courseTitle, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Course Title:", courseTitle);

    // Gửi email xác nhận cho học viên
    const studentEmail = emailjs.send(
      "service_addy4sj",
      "template_g0mp0fa",
      {
        courseTitle,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      },
      "gY_asaAKpxmYdIg29"
    );

    // Gửi email thông báo cho admin
    const adminEmail = emailjs.send(
      "service_addy4sj",
      "template_ff0z4pb",
      {
        courseTitle,
        studentName: formData.name,
        studentEmail: formData.email,
        studentPhone: formData.phone,
        adminEmail: " info@vestaedu.online", // Thay bằng email admin thực tế
      },
      "gY_asaAKpxmYdIg29"
    );

    // Xử lý cả hai email cùng lúc
    Promise.all([studentEmail, adminEmail])
      .then(() => {
        alert("Đăng ký thành công! Kiểm tra email.");
        onClose();
      })
      .catch((error) => {
        console.error("Lỗi khi gửi email:", error);
        alert("Đăng ký thất bại! Hãy thử lại.");
      });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Đăng ký khóa học: {courseTitle}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Tên của bạn"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Số điện thoại"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <div className="button-group">
            <button type="submit" className="submit-btn">
              Gửi Đăng Ký
            </button>
            <button type="button" className="cancel-btn" onClick={onClose}>
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
