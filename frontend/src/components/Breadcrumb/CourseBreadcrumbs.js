import React from "react";
import { Link } from "react-router-dom";
import "./Breadcrumb.css";

const Breadcrumb = (props) => {
  const {
    courseName,
    courseTitle,
    courseBannerImg,
    courseAuthor,
    courseAuthorImg,
    courseLesson,
    courseEnrolled,
  } = props;

  return (
    <div className="react-breadcrumbs single-page-breadcrumbs">
      <div className="breadcrumbs-wrap">
        {/* ── Banner image — always covers, never distorts ── */}
        <img className="banner-img" src={courseBannerImg} alt={courseTitle} />

        {/* ── Multi-layer overlay — guarantees readability ── */}
        <div className="banner-overlay" />

        {/* ── Content — pinned to bottom-left ── */}
        <div className="breadcrumbs-inner">
          <div className="container">
            <div className="breadcrumbs-text">
              {/* Category pill */}
              {courseName && (
                <Link to="#" className="cate">
                  {courseName}
                </Link>
              )}

              {/* Title */}
              <h1 className="breadcrumbs-title">{courseTitle}</h1>

              {/* Meta row */}
              <ul className="user-section">
                {/* Author */}
                {courseAuthor && (
                  <li className="user">
                    {courseAuthorImg && (
                      <span>
                        <img
                          className="author-img"
                          src={courseAuthorImg}
                          alt={courseAuthor}
                        />
                      </span>
                    )}
                    <span>{courseAuthor}</span>
                  </li>
                )}

                {/* Lessons */}
                {courseLesson && (
                  <li>
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ marginRight: 5, color: "#c9a84c" }}
                    >
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                    </svg>
                    {courseLesson} Lessons
                  </li>
                )}

                {/* Enrolled */}
                {courseEnrolled && (
                  <li>
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ marginRight: 5, color: "#c9a84c" }}
                    >
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    {courseEnrolled} Students
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Breadcrumb;
