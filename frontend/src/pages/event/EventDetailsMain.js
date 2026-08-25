import React, { useState } from "react";
import { Link } from "react-router-dom";
import EventRegisterModal from "../../components/ResigterForm/EventRegisterModal";
import "./EventDetailsMain.css";

const EventDetailsMain = ({ event }) => {
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  if (!event) return <div>Event not found</div>;

  const {
    date: eventDate,
    startTime: eventStartTime,
    endTime: eventEndTime,
    location: eventLocation,
    cost: eventCost,
    host: eventHost,
    phone: eventContactNo,
    content: eventContent,
    image: eventImage,
    title: eventTitle,
  } = event;

  const detailItems = [
    {
      label: "Date",
      value: eventDate,
      icon: (
        <svg
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#0d1b2a"
          strokeWidth="1.8"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
    },
    {
      label: "Time",
      value: `${eventStartTime} – ${eventEndTime}`,
      icon: (
        <svg
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#0d1b2a"
          strokeWidth="1.8"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
    {
      label: "Venue",
      value: eventLocation,
      icon: (
        <svg
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#0d1b2a"
          strokeWidth="1.8"
        >
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      ),
    },
    {
      label: "Contact",
      value: eventContactNo,
      icon: (
        <svg
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#0d1b2a"
          strokeWidth="1.8"
        >
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="edm-page">
      <div className="edm-container">
        <div className="edm-grid">
          {/* ── LEFT ── */}
          <div>
            {eventImage && (
              <div className="edm-hero">
                <img src={eventImage} alt="Event" />
                <div className="edm-hero-overlay" />
                <span className="edm-hero-badge">Upcoming Event</span>
              </div>
            )}

            <div className="edm-about">
              <div className="edm-section-label">
                <span className="edm-section-label-line" />
                <span className="edm-section-label-text">About the Event</span>
              </div>
              <h2>{eventTitle || "Event Details"}</h2>
              <div
                className="edm-content"
                dangerouslySetInnerHTML={{ __html: eventContent }}
              />
            </div>

            <div className="edm-info-strip">
              <div className="edm-info-strip-header">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="rgba(255,255,255,0.7)"
                  strokeWidth="1.8"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <h4>Thông tin thêm</h4>
              </div>
              <ul className="edm-info-list">
                <li>
                  <span className="edm-info-icon">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#d4a843"
                      strokeWidth="1.8"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </span>
                  Người tổ chức: <strong>{eventHost}</strong>
                </li>
                <li>
                  <span className="edm-info-icon">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#d4a843"
                      strokeWidth="1.8"
                    >
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                    </svg>
                  </span>
                  Đặt chỗ ngay:&nbsp;
                  <a
                    href="https://forms.gle/nTSLtEqaFXK3sGGJ8"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Bấm vào đây →
                  </a>
                </li>
                <li>
                  <span className="edm-info-icon">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#d4a843"
                      strokeWidth="1.8"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="2" y1="12" x2="22" y2="12" />
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                  </span>
                  🌐 <strong>www.vestaedu.online</strong>
                </li>
                <li>
                  <span className="edm-info-icon">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#d4a843"
                      strokeWidth="1.8"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </span>
                  📞 <strong>{eventContactNo}</strong>
                </li>
              </ul>
            </div>
          </div>

          {/* ── RIGHT SIDEBAR ── */}
          <div className="edm-sidebar">
            <div className="edm-register-card">
              <div className="edm-price-eyebrow">Investment</div>
              <div className="edm-price-value">{eventCost}</div>
              <div className="edm-card-divider" />

              <div className="edm-instructor-row">
                <div className="edm-instructor-avatar">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="rgba(255,255,255,0.7)"
                    strokeWidth="1.5"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div>
                  <div className="edm-instructor-eyebrow">Instructor</div>
                  <div className="edm-instructor-name">{eventHost}</div>
                </div>
              </div>

              <button
                className="edm-join-btn"
                onClick={() => setShowRegisterModal(true)}
              >
                Join Now
                <svg
                  width="18"
                  height="18"
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

              <div className="edm-social-row">
                <span className="edm-social-label">Share</span>
                <Link to="#" className="edm-social-btn">
                  f
                </Link>
                <Link to="#" className="edm-social-btn">
                  in
                </Link>
              </div>
            </div>

            <div className="edm-details-card">
              <div className="edm-details-card-header">
                <span className="edm-details-card-title">Event Details</span>
                <span className="edm-details-card-dot" />
              </div>
              {detailItems.map(({ label, value, icon }) => (
                <div className="edm-detail-item" key={label}>
                  <div className="edm-detail-icon">{icon}</div>
                  <div>
                    <div className="edm-detail-eyebrow">{label}</div>
                    <div className="edm-detail-value">{value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <EventRegisterModal
        open={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        event={event}
      />
    </div>
  );
};

export default EventDetailsMain;
