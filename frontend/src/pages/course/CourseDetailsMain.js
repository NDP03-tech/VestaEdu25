import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";
import RegisterForm from "../../components/ResigterForm/RegisterForm.js";
import config from "../../config.js";
import "./CourseDetailsMain.css";

const CourseDetailsMain = () => {
  const { id } = useParams();
  const courseId = id ? id.trim() : "";

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(
          `${config.API_URL}/api/course/${courseId}`
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch course data.");
        }
        const data = await response.json();
        setCourse(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    if (courseId) fetchCourse();
  }, [courseId]);

  /* ── States ── */
  if (loading)
    return (
      <div className="cdm-state">
        <span className="cdm-spinner" />
        <p>Đang tải khóa học…</p>
      </div>
    );
  if (error)
    return (
      <div className="cdm-state cdm-state--error">
        <span className="cdm-state-icon">✦</span>
        <p>{error}</p>
      </div>
    );
  if (!course)
    return (
      <div className="cdm-state cdm-state--warn">
        <span className="cdm-state-icon">◇</span>
        <p>Không tìm thấy khóa học.</p>
      </div>
    );

  const formattedEvents = Array.isArray(course?.schedule)
    ? course.schedule.map((date) => ({
        title: "Scheduled Class",
        start: `${date}T00:00:00`,
        backgroundColor: "#c9a84c",
        borderColor: "#c9a84c",
        textColor: "#0d1b2e",
      }))
    : [];

  const isFree = !course.price || course.price === 0 || course.price === "0";

  const infoItems = [
    {
      icon: (
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
      ),
      label: "Giảng viên",
      value: course.author,
    },
    {
      icon: (
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
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      ),
      label: "Tên khoá",
      value: course.name,
    },
    {
      icon: (
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
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
      label: "Thời lượng",
      value: course.duration,
    },
    {
      icon: (
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
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <line x1="3" y1="6" x2="3.01" y2="6" />
          <line x1="3" y1="12" x2="3.01" y2="12" />
          <line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
      ),
      label: "Số bài học",
      value: `${course.lesson} bài`,
    },
    {
      icon: (
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
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      ),
      label: "Ngôn ngữ",
      value: course.language,
    },
  ];

  return (
    <div className="cdm-page">
      <div className="cdm-container">
        <div className="cdm-layout">
          {/* ══════════════════════════════════════
              LEFT — Tabs content
          ══════════════════════════════════════ */}
          <div className="cdm-main">
            <Tabs>
              <TabList className="cdm-tablist">
                <Tab className="cdm-tab" selectedClassName="cdm-tab--active">
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
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  Mô tả khoá học
                </Tab>
                <Tab className="cdm-tab" selectedClassName="cdm-tab--active">
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
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  Lịch học
                </Tab>
              </TabList>

              {/* Description */}
              <TabPanel>
                <div className="cdm-panel">
                  <div className="cdm-panel-header">
                    <span className="cdm-eyebrow">Tổng quan</span>
                    <h2 className="cdm-panel-title">Nội dung khoá học</h2>
                    <div className="cdm-rule">
                      <span />
                      <span className="cdm-diamond">◆</span>
                      <span />
                    </div>
                  </div>
                  <div
                    className="cdm-content-body"
                    dangerouslySetInnerHTML={{ __html: course?.content ?? "" }}
                  />
                </div>
              </TabPanel>

              {/* Schedule */}
              <TabPanel>
                <div className="cdm-panel">
                  <div className="cdm-panel-header">
                    <span className="cdm-eyebrow">Thời khoá biểu</span>
                    <h2 className="cdm-panel-title">Lịch học</h2>
                    <div className="cdm-rule">
                      <span />
                      <span className="cdm-diamond">◆</span>
                      <span />
                    </div>
                  </div>
                  <div className="cdm-calendar-wrap">
                    <FullCalendar
                      plugins={[dayGridPlugin, listPlugin]}
                      initialView="dayGridMonth"
                      events={formattedEvents}
                      headerToolbar={{
                        left: "prev,next today",
                        center: "title",
                        right: "dayGridMonth,listWeek",
                      }}
                    />
                  </div>
                </div>
              </TabPanel>
            </Tabs>
          </div>

          {/* ══════════════════════════════════════
              RIGHT — Sticky sidebar
          ══════════════════════════════════════ */}
          <aside className="cdm-sidebar">
            <div className="cdm-sidebar-card">
              {/* Price block */}
              <div className="cdm-price-block">
                <span className="cdm-price-label">Học phí</span>
                <div className={`cdm-price ${isFree ? "cdm-price--free" : ""}`}>
                  {isFree ? "Miễn phí" : `${course.price} VND`}
                </div>
              </div>

              <div className="cdm-sidebar-divider" />

              {/* Info list */}
              <h3 className="cdm-sidebar-title">Thông tin khoá học</h3>
              <ul className="cdm-info-list">
                {infoItems.map((item, i) => (
                  <li key={i} className="cdm-info-item">
                    <span className="cdm-info-icon">{item.icon}</span>
                    <div className="cdm-info-text">
                      <span className="cdm-info-label">{item.label}</span>
                      <span className="cdm-info-value">{item.value}</span>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="cdm-sidebar-divider" />

              {/* CTA */}
              <button
                className="cdm-enroll-btn"
                onClick={() => setShowForm(true)}
              >
                Đăng ký ngay
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
              </button>
              <p className="cdm-enroll-note">
                ✦ Cam kết chất lượng — hoàn tiền trong 7 ngày
              </p>
            </div>
          </aside>
        </div>
      </div>

      {/* Register modal */}
      {showForm && (
        <RegisterForm
          courseTitle={course.name}
          courseId={courseId}
          onClose={() => setShowForm(false)}
          open={showForm}
        />
      )}
    </div>
  );
};

export default CourseDetailsMain;
