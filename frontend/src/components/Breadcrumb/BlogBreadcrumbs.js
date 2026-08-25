import React from "react";
import { Link } from "react-router-dom";

const formatDateVN = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const Breadcrumb = (props) => {
  const {
    postTitle,
    postBannerImg,
    postCategory,
    postAuthor,
    postPublishedDate,
  } = props;

  const defaultBannerImg = "https://via.placeholder.com/1600x600";

  return (
    <div className="react-breadcrumbs single-page-breadcrumbs">
      <div className="breadcrumbs-wrap">
        {/* Banner */}
        <img
          className="banner-img"
          src={postBannerImg || defaultBannerImg}
          alt="Breadcrumbs"
        />

        {/* Overlay nhẹ */}
        <div className="banner-overlay"></div>

        {/* Content */}
        <div className="breadcrumbs-inner">
          <div className="container">
            <div className="breadcrumbs-text">
              <Link to="#" className="cate">
                {postCategory}
              </Link>

              <h1 className="breadcrumbs-title">{postTitle}</h1>

              <ul className="user-section">
                <li>{postAuthor}</li>
                <li>{formatDateVN(postPublishedDate)}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
        .breadcrumbs-wrap {
          position: relative;
          overflow: hidden;
        }

        .banner-img {
          width: 100%;
          height: 450px;
          object-fit: cover;
          display: block;
        }

        /* Overlay nhẹ */
        .banner-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.35);
        }

        .breadcrumbs-inner {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
        }

        .breadcrumbs-text {
          color: #fff;
          max-width: 800px;
        }

        /* TEXT SHADOW MẠNH – CÁCH 2 */
        .breadcrumbs-title {
          font-size: 42px;
          font-weight: 700;
          margin: 15px 0;
          text-shadow:
            0 4px 10px rgba(0,0,0,0.9),
            0 8px 25px rgba(0,0,0,0.8);
        }

        .cate,
        .user-section {
          text-shadow:
            0 2px 6px rgba(0,0,0,0.9),
            0 4px 12px rgba(0,0,0,0.8);
        }

        .user-section {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }

        /* Responsive */
        @media (max-width: 1199px) {
          .banner-img {
            height: 320px;
          }
          .breadcrumbs-title {
            font-size: 30px;
          }
        }

        @media (max-width: 768px) {
          .banner-img {
            height: 220px;
          }
          .breadcrumbs-title {
            font-size: 22px;
          }
        }
        `}
      </style>
    </div>
  );
};

export default Breadcrumb;
