import React from "react";
import { Link } from "react-router-dom";
import courseImg1 from "../../assets/images/course/1.png";
import "./SingleCourseCustom.css";

const SingleCourseThreeCustom = (props) => {
  const {
    itemClass,
    courseID,
    courseImg,
    courseName,
    courseTitle,
    courseAuthor,
    courseType,
    courseLesson,
    coursePrice,
    courseDuration,
    courseReview,
    courseDis,
  } = props;

  const isFree = !coursePrice || coursePrice === 0 || coursePrice === "0";
  const reviewScore = parseFloat(courseReview) || 4.5;
  const fullStars = Math.floor(reviewScore);

  return (
    <div className={itemClass ? itemClass : "scc-outer"}>
      <div className="scc-card">
        {/* ── Thumbnail ── */}
        <Link to={`/course/${courseID}`} className="scc-thumb">
          <img src={courseImg || courseImg1} alt={courseTitle || "Course"} />
          <div className="scc-thumb-overlay">
            <span className="scc-play-ring">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </span>
          </div>
          {/* badges */}
          {courseName && <span className="scc-badge-cat">{courseName}</span>}
          {courseType && <span className="scc-badge-level">{courseType}</span>}
        </Link>

        {/* ── Body ── */}
        <div className="scc-body">
          {/* Title */}
          <h4 className="scc-title">
            <Link to={`/course/${courseID}`}>
              {courseTitle || "The Most Complete Design Thinking Course"}
            </Link>
          </h4>

          {/* Author */}
          <p className="scc-author">
            <svg
              width="12"
              height="12"
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
            {courseAuthor || "Instructor"}
          </p>

          {/* Stats row */}
          <div className="scc-stats">
            {courseLesson && (
              <span className="scc-stat">
                <svg
                  width="12"
                  height="12"
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
                {courseLesson} bài
              </span>
            )}
            {courseDuration && (
              <span className="scc-stat">
                <svg
                  width="12"
                  height="12"
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
                {courseDuration}
              </span>
            )}
          </div>

          {/* Rating */}
          <div className="scc-rating">
            <span className="scc-score">{reviewScore.toFixed(1)}</span>
            <div className="scc-stars">
              {[1, 2, 3, 4, 5].map((i) => (
                <svg key={i} width="12" height="12" viewBox="0 0 24 24">
                  <polygon
                    points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                    fill={i <= fullStars ? "#c9a84c" : "none"}
                    stroke="#c9a84c"
                    strokeWidth="1.5"
                  />
                </svg>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="scc-divider" />

          {/* Price + CTA */}
          <div className="scc-footer">
            <div className="scc-price-wrap">
              {courseDis && <span className="scc-original">{courseDis}</span>}
              <span className={`scc-price${isFree ? " is-free" : ""}`}>
                {isFree ? "Miễn phí" : coursePrice}
              </span>
            </div>
            <Link to={`/course/${courseID}`} className="scc-btn">
              Đăng ký
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
      </div>
    </div>
  );
};

export default SingleCourseThreeCustom;
