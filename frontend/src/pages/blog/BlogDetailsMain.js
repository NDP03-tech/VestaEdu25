import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import config from "../../config";
import "./BlogDetailsMain.css"; // ← Giữ nguyên tên file CSS của bạn

const BlogMain = ({ postTitle, postImg, postContent, currentPostId }) => {
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRelatedPosts = async () => {
      try {
        const response = await fetch(`${config.API_URL}/api/blog`);
        if (!response.ok) throw new Error("Không thể tải dữ liệu bài viết");
        const data = await response.json();
        const filtered = data.filter((post) => post.id !== currentPostId);
        setRelatedPosts(filtered.slice(0, 3));
      } catch (error) {
        console.error("Lỗi API:", error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRelatedPosts();
  }, [currentPostId]);

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "120px 0",
          fontFamily: "DM Sans, sans-serif",
          color: "#a0a0a0",
        }}
      >
        Đang tải...
      </div>
    );
  if (error)
    return (
      <div style={{ textAlign: "center", padding: "80px", color: "#e74c3c" }}>
        ❌ Lỗi: {error}
      </div>
    );

  return (
    <div className="bm-page">
      <div className="bm-container">
        {/* ── Main Article ── */}
        <article className="bm-article">
          {/* Hero image */}
          <div className="bm-body">
            {/* Rich content */}
            <div
              className="bm-content"
              dangerouslySetInnerHTML={{
                __html: postContent?.replace(/\n/g, "<br />"),
              }}
            />

            {/* CTA link */}
            <a
              className="bm-cta-link"
              href="https://goo.gl/xahbn4"
              target="_blank"
              rel="noopener noreferrer"
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
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
              Đăng ký nhập học
            </a>

            <div className="bm-divider" />

            {/* Share bar */}
            <div className="bm-share-bar">
              <span className="bm-share-icon">
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
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
              </span>
              <span className="bm-share-label">Share</span>
              <Link to="#" className="bm-share-btn">
                f
              </Link>
              <Link to="#" className="bm-share-btn">
                in
              </Link>
            </div>

            <div className="bm-divider" />

            {/* Prev / Next nav */}
            <nav className="bm-nav">
              <Link to="#" className="bm-nav-item prev">
                <div className="bm-nav-arrow">
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
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </div>
                <div className="bm-nav-meta">
                  <span className="bm-nav-direction">Prev Post</span>
                  <span className="bm-nav-post-title">Graduate Admissions</span>
                </div>
              </Link>
              <Link to="#" className="bm-nav-item next">
                <div className="bm-nav-arrow">
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
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
                <div className="bm-nav-meta">
                  <span className="bm-nav-direction">Next Post</span>
                  <span className="bm-nav-post-title">Less is More</span>
                </div>
              </Link>
            </nav>
          </div>
        </article>

        {/* ── Related Posts ── */}
        {relatedPosts.length > 0 && (
          <section className="bm-related">
            <div className="bm-related-header">
              <span className="bm-related-line" />
              <h3 className="bm-related-title">Related Posts</h3>
              <span className="bm-related-line-right" />
            </div>

            <div className="bm-related-grid">
              {relatedPosts.map((data) => (
                <Link
                  key={data.id}
                  to={`/blog/${data.id}`}
                  className="bm-related-card"
                >
                  <div className="bm-related-img-wrap">
                    <img
                      className="bm-related-img"
                      src={data.image}
                      alt={data.title}
                    />
                    <span className="bm-related-date">
                      {new Date(data.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                  <div className="bm-related-body">
                    {data.category && (
                      <span className="bm-related-category">
                        {data.category}
                      </span>
                    )}
                    <h4 className="bm-related-post-title">{data.title}</h4>
                    <div className="bm-related-author">
                      {data.authorImg && (
                        <img
                          className="bm-related-author-img"
                          src={data.authorImg}
                          alt={data.author}
                        />
                      )}
                      <span className="bm-related-author-name">
                        {data.author}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default BlogMain;
