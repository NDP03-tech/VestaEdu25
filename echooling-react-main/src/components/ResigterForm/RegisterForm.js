import React, { useState, useEffect } from "react";
import config from "../../config";
import "./RegisterForm.css";

const API_BASE_URL = config.API_URL;

const RegisterForm = ({ courseTitle, courseId, onClose, open }) => {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  /* Lock body scroll when open */
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleChange = (e) => {
    setError("");
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE_URL}/api/course-registrations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, courseId, courseTitle }),
      });
      if (res.ok) {
        setSubmitted(true);
        setTimeout(() => {
          onClose();
          setFormData({ name: "", email: "", phone: "" });
          setSubmitted(false);
        }, 2200);
      } else {
        const err = await res.json();
        setError(err.message || "Đăng ký thất bại. Vui lòng thử lại.");
      }
    } catch {
      setError("Lỗi kết nối. Vui lòng kiểm tra mạng.");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="rf-backdrop"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="rf-modal" role="dialog" aria-modal="true">
        {/* ── Header ── */}
        <div className="rf-header">
          <div className="rf-header-text">
            <span className="rf-eyebrow">Đăng ký khoá học</span>
            <h2 className="rf-title">{courseTitle || "Khoá học"}</h2>
          </div>
          <button className="rf-close" onClick={onClose} aria-label="Đóng">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* ── Body ── */}
        <div className="rf-body">
          {submitted ? (
            /* Success state */
            <div className="rf-success">
              <div className="rf-success-ring">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h3 className="rf-success-title">Đăng ký thành công!</h3>
              <p className="rf-success-sub">
                Chúng tôi sẽ liên hệ với bạn sớm nhất. Cảm ơn bạn đã tin tưởng
                Vesta Academy.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="rf-form" noValidate>
              {/* Full Name */}
              <div className="rf-field">
                <label className="rf-label" htmlFor="rf-name">
                  Họ và tên <span className="rf-required">*</span>
                </label>
                <div className="rf-input-wrap">
                  <span className="rf-input-icon">
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </span>
                  <input
                    id="rf-name"
                    type="text"
                    name="name"
                    className="rf-input"
                    placeholder="Nguyễn Văn A"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    autoComplete="name"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="rf-field">
                <label className="rf-label" htmlFor="rf-email">
                  Email <span className="rf-required">*</span>
                </label>
                <div className="rf-input-wrap">
                  <span className="rf-input-icon">
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </span>
                  <input
                    id="rf-email"
                    type="email"
                    name="email"
                    className="rf-input"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="rf-field">
                <label className="rf-label" htmlFor="rf-phone">
                  Số điện thoại <span className="rf-required">*</span>
                </label>
                <div className="rf-input-wrap">
                  <span className="rf-input-icon">
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </span>
                  <input
                    id="rf-phone"
                    type="tel"
                    name="phone"
                    className="rf-input"
                    placeholder="0912 345 678"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    autoComplete="tel"
                  />
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="rf-error">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  {error}
                </div>
              )}

              {/* Submit */}
              <button type="submit" className="rf-btn" disabled={loading}>
                {loading ? (
                  <>
                    <span className="rf-spinner" /> Đang gửi…
                  </>
                ) : (
                  <>
                    Xác nhận đăng ký
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

              <p className="rf-note">
                ✦ Thông tin của bạn được bảo mật tuyệt đối
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
