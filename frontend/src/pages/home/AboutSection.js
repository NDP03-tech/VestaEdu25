import React from "react";
import { Link } from "react-router-dom";
import aboutImg from "../../assets/images/about/ab.png";
import aboutBadge from "../../assets/images/logos/logo-footer.png";
import "./About.css";

const About = () => {
  return (
    <section className="ab-section">
      <div className="ab-container">
        <div className="ab-inner">
          {/* ── LEFT: Image ────────────────────────── */}
          <div className="ab-img-col">
            <div className="ab-img-frame">
              {/* Corner accents */}
              <span className="ab-corner ab-corner--tl" />
              <span className="ab-corner ab-corner--br" />

              {/* Main photo */}
              <img
                src={aboutImg}
                alt="About Vesta Academy"
                className="ab-main-img"
              />

              {/* Floating logo badge */}
              <div className="ab-badge">
                <img src={aboutBadge} alt="Vesta Logo" />
              </div>

              {/* Experience chip */}
              <div className="ab-chip">
                <span className="ab-chip-num">14</span>
                <span className="ab-chip-text">
                  Năm
                  <br />
                  kinh nghiệm
                </span>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Content ─────────────────────── */}
          <div className="ab-text-col">
            <span className="ab-eyebrow">Chào mừng đến với</span>

            <h2 className="ab-title">
              VESTA
              <br />
              <em>ACADEMY</em>
            </h2>

            <div className="ab-rule">
              <span />
              <span className="ab-diamond">◆</span>
              <span />
            </div>

            <p className="ab-lead">
              Giáo dục không chỉ là việc truyền đạt kiến thức, mà còn là hành
              trình khám phá tri thức và chắp cánh ước mơ.
            </p>

            <p className="ab-body">
              Tại đây, chúng tôi cam kết mang đến những bài học đầy cảm hứng,
              giúp bạn mở rộng tầm nhìn và chuẩn bị cho tương lai thành công.
            </p>

            {/* Stats row */}
            <div className="ab-stats">
              <div className="ab-stat">
                <span className="ab-stat-num">7.0</span>
                <span className="ab-stat-label">IELTS mục tiêu</span>
              </div>
              <div className="ab-stat-sep" />
              <div className="ab-stat">
                <span className="ab-stat-num">4</span>
                <span className="ab-stat-label">Tháng / khoá</span>
              </div>
              <div className="ab-stat-sep" />
              <div className="ab-stat">
                <span className="ab-stat-num">100%</span>
                <span className="ab-stat-label">Cam kết đầu ra</span>
              </div>
            </div>

            {/* CTA row */}
            <div className="ab-actions">
              <Link to="/about" className="ab-btn-primary">
                Tìm hiểu thêm
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
              </Link>

              <div className="ab-support">
                <span className="ab-support-label">Hỗ trợ</span>
                <Link
                  to="mailto:info@vestaedu.online"
                  className="ab-support-link"
                >
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
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  info@vestaedu.online
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
