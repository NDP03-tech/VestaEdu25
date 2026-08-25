import React from "react";
import icon1 from "../../assets/images/topics/icon.png";
import icon2 from "../../assets/images/topics/icon2.png";
import icon3 from "../../assets/images/topics/icon3.png";
import "./Feature.css";

const features = [
  {
    icon: icon1,
    number: "01",
    title: "Đội ngũ giảng viên chất lượng",
    points: [
      "Founder: Thạc sĩ Lê Hương Ly – cựu giám khảo Cambridge, IELTS Speaking 9.0, 14 năm kinh nghiệm, từng huấn luyện đội tuyển Ams.",
      'Phương pháp độc quyền: Học viên được "ốp sát" hằng ngày qua bài tập, kiểm tra và chữa bài chi tiết — học gì chắc nấy.',
    ],
  },
  {
    icon: icon2,
    number: "02",
    title: "Lộ trình học tập cá nhân hóa",
    points: [
      "4 tháng/khóa để tăng band, 1 năm đạt IELTS 7.0 từ con số 0 — lộ trình khoa học và tối ưu cho từng học viên.",
      "Giáo viên & trợ giảng tận tâm, kết hợp công nghệ Hybrid (online + offline) để hỗ trợ mọi lúc, mọi nơi.",
    ],
  },
  {
    icon: icon3,
    number: "03",
    title: "Cam kết chất lượng & hỗ trợ",
    points: [
      "Đầu ra minh bạch: kiểm tra giữa kỳ, cuối kỳ, giám sát tiến độ chặt chẽ. Học nhanh – thi chắc với sự đồng hành của Vesta.",
      "Hỗ trợ bền vững: tài liệu phong phú, lớp bù cho học sinh yếu, học bổng cho hoàn cảnh khó khăn.",
    ],
  },
];

const Feature = () => {
  return (
    <section className="ft-section">
      <div className="ft-container">
        {/* ── Header ── */}
        <div className="ft-header">
          <span className="ft-eyebrow">Tại sao chọn chúng tôi</span>
          <h2 className="ft-title">USP / Điểm Mạnh</h2>
          <div className="ft-rule">
            <span />
            <span className="ft-diamond">◆</span>
            <span />
          </div>
          <p className="ft-subtitle">
            Ba lý do học viên tin tưởng và gắn bó cùng Vesta Academy trên hành
            trình chinh phục IELTS.
          </p>
        </div>

        {/* ── Cards ── */}
        <div className="ft-grid">
          {features.map((f, i) => (
            <div
              className="ft-card"
              key={i}
              style={{ animationDelay: `${i * 0.12}s` }}
            >
              {/* Number watermark */}
              <span className="ft-card-num">{f.number}</span>

              {/* Icon */}
              <div className="ft-icon-wrap">
                <img src={f.icon} alt={f.title} />
              </div>

              {/* Content */}
              <div className="ft-card-body">
                <h3 className="ft-card-title">{f.title}</h3>
                <div className="ft-card-divider" />
                <ul className="ft-card-points">
                  {f.points.map((p, j) => (
                    <li key={j}>
                      <span className="ft-bullet">◈</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Feature;
