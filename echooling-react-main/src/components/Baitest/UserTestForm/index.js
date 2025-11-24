
import React, { useState } from 'react';

const UserForm = ({ onFormComplete }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    course: '',
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleConfirm = (e) => {
    e.preventDefault();
    if (Object.values(formData).some((value) => value.trim() === '')) {
      setMessage('❌ Vui lòng nhập đầy đủ thông tin trước khi tiếp tục!');
      return;
    }
    onFormComplete(formData); // Gửi thông tin tới component cha
  };

  return (
    <div className="card shadow p-4">
      <h3 className="text-center">Thông tin liên hệ</h3>
      {message && <div className={`alert alert-danger`}>{message}</div>}
      <form onSubmit={handleConfirm}>
        <div className="mb-3">
          <label className="form-label">Họ và Tên</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-control" required />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-control" required />
        </div>
        <div className="mb-3">
          <label className="form-label">Số điện thoại</label>
          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="form-control" required />
        </div>
        <div className="mb-3">
          <label className="form-label">Khóa học muốn đăng ký</label>
          <input type="text" name="course" value={formData.course} onChange={handleChange} className="form-control" required />
        </div>
        <button type="submit" className="btn btn-primary w-100">Xác nhận thông tin</button>
      </form>
    </div>
  );
};

export default UserForm;