import React, { useState } from "react";
import { Modal, Form, message } from "antd";
import axios from "axios";
import config from "../../config";

const EventRegisterModal = ({ open, onClose, event }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      await axios.post(`${config.API_URL}/api/event-registrations`, {
        ...values,
        eventId: event.id,
        eventTitle: event.eventTitle || event.title,
      });
      message.success("Đăng ký thành công!");
      onClose();
      form.resetFields();
    } catch (err) {
      console.error(err);
      message.error(err.response?.data?.message || "Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    height: "48px",
    borderRadius: "10px",
    border: "1.5px solid #e8e6e0",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "14px",
    color: "#1a1a1a",
    padding: "0 16px",
    background: "#fafaf8",
    transition: "all 0.25s ease",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  };

  return (
    <>
      {/* Google Font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

        .erm-modal .ant-modal-content {
          border-radius: 24px !important;
          overflow: hidden !important;
          padding: 0 !important;
          box-shadow: 0 32px 80px rgba(13,27,42,0.22) !important;
        }

        .erm-modal .ant-modal-header {
          display: none !important;
        }

        .erm-modal .ant-modal-body {
          padding: 0 !important;
        }

        .erm-modal .ant-modal-footer {
          display: none !important;
        }

        .erm-modal .ant-modal-close {
          top: 20px !important;
          right: 20px !important;
          color: rgba(255,255,255,0.6) !important;
          transition: color 0.2s !important;
        }

        .erm-modal .ant-modal-close:hover {
          color: #f0c96a !important;
          background: transparent !important;
        }

        .erm-modal .ant-form-item {
          margin-bottom: 20px !important;
        }

        .erm-modal .ant-form-item-label > label {
          font-family: 'DM Sans', sans-serif !important;
          font-size: 11px !important;
          font-weight: 600 !important;
          letter-spacing: 2px !important;
          text-transform: uppercase !important;
          color: #a0a0a0 !important;
        }

        .erm-modal .ant-form-item-explain-error {
          font-family: 'DM Sans', sans-serif !important;
          font-size: 12px !important;
          margin-top: 4px !important;
        }

        .erm-input:focus,
        .erm-input:hover {
          border-color: #d4a843 !important;
          background: #ffffff !important;
          box-shadow: 0 0 0 3px rgba(212,168,67,0.12) !important;
        }
      `}</style>

      <Modal
        open={open}
        onCancel={onClose}
        footer={null}
        centered
        zIndex={2000}
        className="erm-modal"
        width={480}
      >
        {/* ── Header (navy gradient) ── */}
        <div
          style={{
            background:
              "linear-gradient(145deg, #0d1b2a 0%, #16213e 55%, #1e3a5f 100%)",
            padding: "40px 40px 36px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Decorative ring */}
          <div
            style={{
              position: "absolute",
              top: "-60px",
              right: "-60px",
              width: "200px",
              height: "200px",
              borderRadius: "50%",
              border: "1.5px solid rgba(212,168,67,0.15)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-30px",
              left: "-30px",
              width: "130px",
              height: "130px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(212,168,67,0.1) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          {/* Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "rgba(212,168,67,0.18)",
              border: "1px solid rgba(212,168,67,0.4)",
              borderRadius: "100px",
              padding: "5px 14px",
              marginBottom: "14px",
            }}
          >
            <span
              style={{
                width: "5px",
                height: "5px",
                borderRadius: "50%",
                background: "#f0c96a",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "10px",
                fontWeight: "600",
                letterSpacing: "2.5px",
                textTransform: "uppercase",
                color: "#f0c96a",
              }}
            >
              Event Registration
            </span>
          </div>

          {/* Title */}
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "1.65rem",
              fontWeight: "700",
              color: "#ffffff",
              lineHeight: 1.25,
              margin: 0,
              letterSpacing: "-0.3px",
              position: "relative",
              zIndex: 1,
            }}
          >
            {event?.eventTitle || event?.title}
          </h2>

          {/* Gold line */}
          <div
            style={{
              width: "40px",
              height: "2px",
              background: "linear-gradient(90deg, #f0c96a, #d4a843)",
              borderRadius: "2px",
              marginTop: "16px",
            }}
          />
        </div>

        {/* ── Form body ── */}
        <div
          style={{
            padding: "36px 40px 40px",
            background: "#fafaf8",
          }}
        >
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            {/* Họ và tên */}
            <Form.Item
              label="Họ và tên"
              name="name"
              rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
            >
              <input
                className="erm-input"
                placeholder="Nguyễn Văn A"
                style={inputStyle}
                onChange={(e) => form.setFieldValue("name", e.target.value)}
              />
            </Form.Item>

            {/* Email */}
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  type: "email",
                  message: "Email không hợp lệ",
                },
              ]}
            >
              <input
                className="erm-input"
                placeholder="example@email.com"
                type="email"
                style={inputStyle}
                onChange={(e) => form.setFieldValue("email", e.target.value)}
              />
            </Form.Item>

            {/* Số điện thoại */}
            <Form.Item
              label="Số điện thoại"
              name="phone"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại" },
              ]}
            >
              <input
                className="erm-input"
                placeholder="0901 234 567"
                type="tel"
                style={inputStyle}
                onChange={(e) => form.setFieldValue("phone", e.target.value)}
              />
            </Form.Item>

            {/* Divider */}
            <div
              style={{
                height: "1px",
                background:
                  "linear-gradient(90deg, #d4a843, #e8e6e0 60%, transparent)",
                margin: "8px 0 28px",
              }}
            />

            {/* Submit button */}
            <button
              type="button"
              onClick={() => form.submit()}
              disabled={loading}
              style={{
                width: "100%",
                padding: "16px 24px",
                background: loading
                  ? "rgba(13,27,42,0.5)"
                  : "linear-gradient(135deg, #f0c96a 0%, #d4a843 100%)",
                border: "none",
                borderRadius: "12px",
                color: "#0d1b2a",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "14px",
                fontWeight: "700",
                letterSpacing: "1.8px",
                textTransform: "uppercase",
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                transition: "all 0.3s ease",
                boxShadow: loading
                  ? "none"
                  : "0 8px 28px rgba(212,168,67,0.38)",
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 14px 40px rgba(212,168,67,0.52)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 8px 28px rgba(212,168,67,0.38)";
              }}
            >
              {loading ? (
                <>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  >
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                  </svg>
                  Đang gửi...
                </>
              ) : (
                <>
                  Gửi đăng ký
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </>
              )}
            </button>

            {/* Note */}
            <p
              style={{
                textAlign: "center",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "12px",
                color: "#a0a0a0",
                marginTop: "16px",
                marginBottom: 0,
              }}
            >
              Thông tin của bạn được bảo mật tuyệt đối 🔒
            </p>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default EventRegisterModal;
