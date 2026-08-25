import React from "react";
import aboutImg from "../../assets/images/about/ab.png";
import shapeImg from "../../assets/images/logos/logo-footer.png";
import "./AboutPart.css";

const AboutPart = () => {
  return (
    <div className="about-page">
      {/* ── HERO SECTION ─────────────────────────────────────── */}
      <section className="about-hero">
        <div className="about-container">
          <div className="about-hero-inner">
            {/* Left — image */}
            <div className="about-img-col">
              <div className="about-img-frame">
                <img
                  src={aboutImg}
                  alt="About Vesta Academy"
                  className="about-main-img"
                />
                {/* floating logo badge */}
                <div className="about-logo-badge">
                  <img src={shapeImg} alt="Vesta Logo" />
                </div>
                {/* decorative corner accents */}
                <span className="about-corner about-corner--tl" />
                <span className="about-corner about-corner--br" />
              </div>
            </div>

            {/* Right — text */}
            <div className="about-text-col">
              <span className="about-eyebrow">Chào mừng đến với</span>
              <h1 className="about-headline">
                VESTA
                <br />
                <em>ACADEMY</em>
              </h1>
              <div className="about-rule">
                <span />
                <span className="about-diamond">◆</span>
                <span />
              </div>
              <p className="about-lead">
                Giáo dục không chỉ là việc truyền đạt kiến thức, mà còn là hành
                trình khám phá tri thức và chắp cánh ước mơ.
              </p>
              <p className="about-body-text">
                Tại đây, chúng tôi cam kết mang đến những bài học đầy cảm hứng,
                giúp bạn mở rộng tầm nhìn và chuẩn bị cho tương lai thành công.
              </p>
              <a
                href="mailto:info@vestaedu.online"
                className="about-contact-link"
              >
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
                info@vestaedu.online
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── ABOUT DETAIL SECTION ─────────────────────────────── */}
      <section className="about-detail">
        <div className="about-container">
          <div className="about-detail-header">
            <span className="about-eyebrow">Câu chuyện của chúng tôi</span>
            <h2 className="about-detail-title">About VESTA ACADEMY</h2>
            <div className="about-rule">
              <span />
              <span className="about-diamond">◆</span>
              <span />
            </div>
          </div>

          {/* Cards grid */}
          <div className="about-cards">
            {/* Card 1 */}
            <div className="about-card">
              <div className="about-card-num">01</div>
              <h3 className="about-card-title">Hành trình ra đời</h3>
              <p className="about-card-text">
                <strong>Vesta Academy</strong> được sáng lập bởi Thạc sĩ{" "}
                <strong>Lê Hương Ly</strong>, nhà giáo dục tận tâm với{" "}
                <strong>14 năm</strong> kinh nghiệm giảng dạy tiếng Anh chuyên
                sâu.
              </p>
              <p className="about-card-text">
                Từng đảm nhận vai trò giám khảo hỏi thi nói Cambridge (
                <strong>KET, PET</strong>), giảng viên tại{" "}
                <strong>Đại học Ngoại ngữ – ĐHQGHN (ULIS)</strong>, và giáo viên
                tại <strong>Hà Nội – Amsterdam</strong> &{" "}
                <strong>Greenfield School</strong> (hệ Cambridge).
              </p>
            </div>

            {/* Card 2 */}
            <div className="about-card">
              <div className="about-card-num">02</div>
              <h3 className="about-card-title">Tầm nhìn & Sứ mệnh</h3>
              <p className="about-card-text">
                Kiến tạo cộng đồng học thuật nơi mọi học viên đều có thể tiến bộ
                vượt bậc, hướng tới giáo dục bền vững và bình đẳng giới.
              </p>
              <blockquote className="about-quote">
                "Không có học sinh kém,
                <br />
                chỉ là chưa biết đường."
              </blockquote>
            </div>

            {/* Card 3 */}
            <div className="about-card">
              <div className="about-card-num">03</div>
              <h3 className="about-card-title">Chiến lược triển khai</h3>
              <ul className="about-strategy-list">
                <li>
                  <span className="about-strategy-icon">◈</span>
                  <div>
                    <strong>Lộ trình cá nhân hóa</strong>
                    <p>
                      Chương trình riêng cho từng học viên, tiến bộ rõ rệt trong
                      thời gian ngắn.
                    </p>
                  </div>
                </li>
                <li>
                  <span className="about-strategy-icon">◈</span>
                  <div>
                    <strong>Ôn luyện hằng ngày</strong>
                    <p>
                      Bài tập bắt buộc và kiểm tra từ vựng liên tục mỗi ngày.
                    </p>
                  </div>
                </li>
                <li>
                  <span className="about-strategy-icon">◈</span>
                  <div>
                    <strong>Cam kết đầu ra</strong>
                    <p>
                      4 tháng tăng <strong>1–2 band IELTS</strong>; 1 năm từ số
                      0 đạt <strong>IELTS 7.0</strong>.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Stats bar */}
          <div className="about-stats">
            <div className="about-stat">
              <span className="about-stat-num">14</span>
              <span className="about-stat-label">Năm kinh nghiệm</span>
            </div>
            <div className="about-stat-divider" />
            <div className="about-stat">
              <span className="about-stat-num">7.0</span>
              <span className="about-stat-label">IELTS mục tiêu</span>
            </div>
            <div className="about-stat-divider" />
            <div className="about-stat">
              <span className="about-stat-num">4</span>
              <span className="about-stat-label">Tháng / khoá học</span>
            </div>
            <div className="about-stat-divider" />
            <div className="about-stat">
              <span className="about-stat-num">100%</span>
              <span className="about-stat-label">Cam kết đầu ra</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPart;
