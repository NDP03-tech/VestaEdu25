import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Navigate } from "react-router-dom";
import config from "../../config";
import "./LoginMain.css";

const LoginMain = ({ onLogin, setIsLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [redirectToDashboard, setRedirectToDashboard] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      const res = await axios.post(`${config.API_URL}/api/login`, {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setIsLoggedIn(true);
      onLogin();
      setRedirectToDashboard(true);
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Email hoặc mật khẩu không đúng."
      );
    } finally {
      setLoading(false);
    }
  };

  if (redirectToDashboard) {
    const role = localStorage.getItem("role");
    return <Navigate to={role === "admin" ? "/admin" : "/user"} />;
  }

  return (
    <div className="lm-page">
      {/* ── Decorative left panel ── */}
      <div className="lm-panel">
        <div className="lm-panel-inner">
          <div className="lm-panel-logo">V</div>
          <h2 className="lm-panel-headline">
            Chào mừng
            <br />
            trở lại
          </h2>
          <p className="lm-panel-sub">
            Tiếp tục hành trình chinh phục IELTS cùng Vesta Academy.
          </p>
          <div className="lm-panel-rule">
            <span />
            <span className="lm-diamond">◆</span>
            <span />
          </div>
          <ul className="lm-panel-stats">
            <li>
              <strong>14</strong> năm kinh nghiệm
            </li>
            <li>
              <strong>IELTS 7.0</strong> trong 1 năm
            </li>
            <li>
              <strong>100%</strong> cam kết đầu ra
            </li>
          </ul>
        </div>
      </div>

      {/* ── Form panel ── */}
      <div className="lm-form-panel">
        <div className="lm-form-wrap">
          {/* Header */}
          <span className="lm-eyebrow">Vesta Academy</span>
          <h1 className="lm-title">Đăng Nhập</h1>
          <div className="lm-rule">
            <span />
            <span className="lm-diamond lm-diamond--dark">◆</span>
            <span />
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="lm-form" noValidate>
            {/* Email */}
            <div className="lm-field">
              <label className="lm-label" htmlFor="lm-email">
                Email
              </label>
              <div className="lm-input-wrap">
                <span className="lm-input-icon">
                  <svg
                    width="16"
                    height="16"
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
                  id="lm-email"
                  type="email"
                  className="lm-input"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div className="lm-field">
              <div className="lm-label-row">
                <label className="lm-label" htmlFor="lm-pass">
                  Mật Khẩu
                </label>
                <a href="/forgot-password" className="lm-forgot">
                  Quên mật khẩu?
                </a>
              </div>
              <div className="lm-input-wrap">
                <span className="lm-input-icon">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  id="lm-pass"
                  type={showPass ? "text" : "password"}
                  className="lm-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="lm-toggle-pass"
                  onClick={() => setShowPass((v) => !v)}
                  aria-label="Toggle password visibility"
                >
                  {showPass ? (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Error message */}
            {message && (
              <div className="lm-error">
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
                {message}
              </div>
            )}

            {/* Submit */}
            <button type="submit" className="lm-btn" disabled={loading}>
              {loading ? (
                <span className="lm-spinner" />
              ) : (
                <>
                  Đăng Nhập
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
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginMain;
