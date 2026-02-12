import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import config from '../../config';
const BlogMain = ({ postTitle, postImg, postContent, currentPostId }) => {
    const [relatedPosts, setRelatedPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRelatedPosts = async () => {
            try {
                const response = await fetch(`${config.API_URL}/api/blog`);
                if (!response.ok) {
                    throw new Error('Không thể tải dữ liệu bài viết');
                }
                const data = await response.json();
                const filtered = data.filter(post => post.id !== currentPostId); // Loại trừ bài hiện tại
                setRelatedPosts(filtered.slice(0, 3)); // Hiển thị 3 bài liên quan
            } catch (error) {
                console.error("Lỗi API:", error.message);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRelatedPosts();
    }, [currentPostId]);

    if (loading) return <div>⏳ Đang tải...</div>;
    if (error) return <div style={{ color: 'red' }}>❌ Lỗi: {error}</div>;

    return (
        <div className="back__course__page_grid react-courses__single-page pb---40 pt---110">
            <div className="container">
                <div className="row">
                    <div>
                        <div className="blog-single-inner">
                            <div className="blog-content">
                                <div className="blog-image" style={{ maxWidth: '800px', margin: '20px auto', overflow: 'hidden' }}>
                                    <img 
                                        src={postImg} 
                                        alt={postTitle} 
                                        style={{ width: '100%', height: 'auto', objectFit: 'cover' }} 
                                    />
                                </div>

                                <p dangerouslySetInnerHTML={{ __html: postContent.replace(/\n/g, '<br />') }}></p>

                                <a href="https://goo.gl/xahbn4" target="_blank" rel="noopener noreferrer">
                                    Link đăng ký nhập học : https://goo.gl/xahbn4
                                </a>

                                <div className="blog-tags">
                                    <div className="row align-items-center">
                                        <div className="col-md-2">
                                            <div className="share-course">
                                                Share this post:
                                                <em>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
                                                        viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                                                        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
                                                        className="feather feather-share-2">
                                                        <circle cx="18" cy="5" r="3"></circle>
                                                        <circle cx="6" cy="12" r="3"></circle>
                                                        <circle cx="18" cy="19" r="3"></circle>
                                                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                                                        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                                                    </svg>
                                                </em>
                                                <span>
                                                    <Link to="#"><i aria-hidden="true" className="social_facebook"></i></Link>
                                                    <Link to="#"><i aria-hidden="true" className="social_linkedin"></i></Link>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="single-nav">
                                    <div className="back-prev">
                                        <Link to="#"><i className="back-icon arrow_carrot-left"></i> PREV POST <em>Graduate Admissions</em></Link>
                                    </div>
                                    <div className="back-next">
                                        <Link to="#"> NEXT POST <i className="back-icon arrow_carrot-right"></i> <em> Less is More</em></Link>
                                    </div>
                                </div>

                                <div className="react-course-filter related__course">
                                    <h3>Related Posts</h3>
                                    <div className="row">
                                        {relatedPosts.map((data) => (
                                            <div key={data.id} className="single-studies col-md-4 grid-item">
                                                <div className="inner-course">
                                                    <div className="case-img">
                                                        <Link to="#" className="cate-w">
                                                            {new Date(data.createdAt).toLocaleDateString('vi-VN')}
                                                        </Link>
                                                        <img src={data.image} alt={data.title} />
                                                    </div>
                                                    <div className="case-content">
                                                        <em className="cate-camp">{data.category}</em>
                                                        <h4 className="case-title">
                                                            <Link to={`/blog/${data.id}`}>{data.title}</Link>
                                                        </h4>
                                                        <div className="react__user">
                                                            <img src={data.authorImg} alt={data.author} /> {data.author}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogMain;
