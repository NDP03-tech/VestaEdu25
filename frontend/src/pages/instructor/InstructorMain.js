import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import config from "../../config";
import "./InstructorMain.css";

const InstructorMain = () => {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${config.API_URL}/api/instructors`)
      .then((res) => res.json())
      .then((res) => {
        setInstructors(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Không thể tải dữ liệu.");
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className="im-state">
        <span className="im-spinner" />
        <p>Đang tải giảng viên…</p>
      </div>
    );

  if (error)
    return (
      <div className="im-state im-state--error">
        <span className="im-state-icon">✦</span>
        <p>{error}</p>
      </div>
    );

  return (
    <section className="im-page">
      <div className="im-container">
        {/* ── Page header ── */}
        <div className="im-header">
          <span className="im-eyebrow">Đội ngũ của chúng tôi</span>
          <h1 className="im-title">Giảng Viên</h1>
          <div className="im-rule">
            <span />
            <span className="im-diamond">◆</span>
            <span />
          </div>
          <p className="im-subtitle">
            Những nhà giáo dục tận tâm, giàu kinh nghiệm — đồng hành cùng bạn
            trên hành trình chinh phục IELTS.
          </p>
        </div>

        {/* ── Grid ── */}
        <div className="im-grid">
          {instructors.slice(0, 8).map((data, index) => (
            <div
              className="im-card"
              key={data.id}
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              {/* Image */}
              <div className="im-card-img">
                <img
                  src={
                    data.image?.startsWith("http")
                      ? data.image
                      : `${config.API_URL}/uploads/${data.image}`
                  }
                  alt={data.name}
                />

                {/* Hover overlay */}
                <div className="im-card-overlay">
                  {data.bio && <p className="im-card-bio">{data.bio}</p>}
                  <div className="im-card-socials">
                    {data.facebook && (
                      <a
                        href={data.facebook}
                        target="_blank"
                        rel="noreferrer"
                        className="im-social-btn"
                        aria-label="Facebook"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                        </svg>
                      </a>
                    )}
                    {data.twitter && (
                      <a
                        href={data.twitter}
                        target="_blank"
                        rel="noreferrer"
                        className="im-social-btn"
                        aria-label="Twitter / X"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                        </svg>
                      </a>
                    )}
                    {data.linkedin && (
                      <a
                        href={data.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="im-social-btn"
                        aria-label="LinkedIn"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                          <rect x="2" y="9" width="4" height="12" />
                          <circle cx="4" cy="4" r="2" />
                        </svg>
                      </a>
                    )}
                  </div>
                  <Link
                    to={`/instructor/${data.id}`}
                    className="im-card-profile-btn"
                  >
                    Xem hồ sơ
                    <svg
                      width="13"
                      height="13"
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
                </div>
              </div>

              {/* Bottom info */}
              <div className="im-card-info">
                <h4 className="im-card-name">
                  <Link to={`/instructor/${data.id}`}>{data.name}</Link>
                </h4>
                {data.designation && (
                  <p className="im-card-role">{data.designation}</p>
                )}
                <div className="im-card-accent" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InstructorMain;
