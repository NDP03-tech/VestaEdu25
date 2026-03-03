import React from "react";
import { Link } from "react-router-dom";
import "./Breadcrumb.css"; // 👈 nhớ import css

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
        {/* Banner Image */}
        <img className="banner-img" src={courseBannerImg} alt={courseTitle} />

        {/* Overlay */}
        <div className="banner-overlay"></div>

        {/* Content */}
        <div className="breadcrumbs-inner">
          <div className="container">
            <div className="breadcrumbs-text">
              <Link to="#" className="cate">
                {courseName}
              </Link>

              <h1 className="breadcrumbs-title">{courseTitle}</h1>

              <ul className="user-section">
                <li className="user">
                  <span>
                    <img
                      className="author-img"
                      src={courseAuthorImg}
                      alt="author"
                    />
                  </span>
                  <span>{courseAuthor}</span>
                </li>

                <li>{courseLesson} Lessons</li>

                <li>{courseEnrolled} Students</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Breadcrumb;
