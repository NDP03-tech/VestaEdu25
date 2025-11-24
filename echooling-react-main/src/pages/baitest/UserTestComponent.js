
import React, { useState } from 'react';
import UserForm from '../../components/Baitest/UserTestForm';
import TestSection from '.';
import emailjs from 'emailjs-com';

const UserTestComponent = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [isTestSubmitted, setIsTestSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFormComplete = (data) => {
    setUserInfo(data);
    setIsTestSubmitted(true);
  };

  const handleSubmit = (userInfo, score) => {
    setLoading(true); // Bắt đầu tải
    setMessage(''); // Reset thông báo

    const templateParams = {
      name: userInfo.name,
      email: userInfo.email,
      phone: userInfo.phone,
      course: userInfo.course,
      score: score,
    };

    emailjs.send('service_addy4sj', 'template_ff0z4pb', templateParams, 'gY_asaAKpxmYdIg29')
      .then((response) => {
        console.log('SUCCESS!', response.status, response.text);
        setMessage('Thông tin đã được gửi thành công!');
      }, (err) => {
        console.error('FAILED...', err);
        setMessage('Có lỗi xảy ra, vui lòng thử lại!');
      })
      .finally(() => {
        setLoading(false); // Kết thúc tải
        setIsTestSubmitted(false); // Quay về màn hình chính
        setUserInfo(null); // Reset thông tin người dùng
      });
  };

  return (
    <div className="container">
      {loading && <div className="loading">Đang gửi thông tin...</div>}
      {message && <div className="alert alert-info">{message}</div>}
      {!isTestSubmitted ? (
        <UserForm onFormComplete={handleFormComplete} />
      ) : (
        <TestSection userInfo={userInfo} handleSubmit={handleSubmit} />
      )}
    </div>
  );
};


export default UserTestComponent;