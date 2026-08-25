import React from "react";
import { Link } from "react-router-dom";
import defaultCourseImg from "../../assets/images/course/1.jpg";
import defaultAuthorImg from "../../assets/images/course/1.jpg";
import "./SingleCourseList.css";

const SingleCourseList = (props) => {
  const {
    itemClass,
    courseID,
    courseImg,
    courseName,
    courseTitle,
    courseAuthor,
    courseAuthorImg,
    courseLesson,
    coursePrice,
  } = props;

  const courseImageUrl = courseImg?.startsWith("http")
    ? courseImg
    : `https://res.cloudinary.com/dubzoozqi/image/upload/${courseImg}`;

  const authorImageUrl = courseAuthorImg?.startsWith("http")
    ? courseAuthorImg
    : `https://res.cloudinary.com/dubzoozqi/image/upload/${courseAuthorImg}`;

  const isFree = !coursePrice || coursePrice === 0 || coursePrice === "0";

  return (
    <div className={itemClass ? itemClass : "scl-wrapper"}>
      <div className="scl-card">
        {/* ── Image Panel ── */}
        <div className="scl-image-wrap">
          <Link to={`/course/${courseID}`} className="scl-img-link">
            <img
              src={courseImg ? courseImageUrl : defaultCourseImg}
              alt={courseTitle || "Course"}
              className="scl-img"
            />
            <div className="scl-img-overlay" />
          </Link>
          <span className="scl-category-badge">{courseName || "Beginner"}</span>
        </div>

        {/* ── Content Panel ── */}
        <div className="scl-content">
          {/* Title */}
          <h4 className="scl-title">
            <Link to={`/course/${courseID}`}>
              {courseTitle ||
                "The Most Complete Design Thinking Course On The Market."}
            </Link>
          </h4>

          {/* Author */}
          <div className="scl-author">
            <div className="scl-author-avatar">
              <img
                src={courseAuthorImg ? authorImageUrl : defaultAuthorImg}
                alt={courseAuthor || "Author"}
              />
            </div>
            <span className="scl-author-name">
              {courseAuthor || "Unknown Author"}
            </span>
          </div>

          {/* Divider */}
          <div className="scl-divider" />

          {/* Meta row */}
          <div className="scl-meta">
            <div className="scl-lessons">
              <svg
                xmlns="http://www.w3.org/2000/svg"
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
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
              <span>{courseLesson || "0"} Lessons</span>
            </div>

            <div className={`scl-price ${isFree ? "scl-price--free" : ""}`}>
              {isFree ? "Free" : coursePrice}
            </div>
          </div>
        </div>

        {/* ── CTA Arrow ── */}
        <Link
          to={`/course/${courseID}`}
          className="scl-cta"
          aria-label="View course"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default SingleCourseList;
