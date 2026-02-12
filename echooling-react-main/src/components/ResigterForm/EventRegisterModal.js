import React, { useState } from 'react';
import { Modal, Input, Form, message } from 'antd';
import axios from 'axios';
import config from '../../config';

const EventRegisterModal = ({ open, onClose, event }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm(); // ✅ form instance

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      await axios.post(`${config.API_URL}/api/event-registrations`, { 
        ...values,
  eventId: event.id,
        eventTitle: event.eventTitle || event.title,
      });
      message.success("Đăng ký thành công!"); // ✅ sẽ hiển thị
      onClose();
      form.resetFields(); // ✅ reset form sau khi submit
    } catch (err) {
      console.error(err);
      message.error(err.response?.data?.message || "Đăng ký thất bại"); // ✅ sẽ hiển thị
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={`Đăng ký sự kiện: ${event?.eventTitle || event?.title}`}
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()} // ✅ dùng form instance
      confirmLoading={loading}
      okText="Gửi đăng ký"
      centered
      zIndex={2000}
    >
      <Form
        form={form} // ✅ gắn form instance
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item label="Họ và tên" name="name" rules={[{ required: true }]}>
          <Input placeholder="Nhập họ tên" />
        </Form.Item>
        <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
          <Input placeholder="Nhập email" />
        </Form.Item>
        <Form.Item label="Số điện thoại" name="phone" rules={[{ required: true }]}>
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EventRegisterModal;
