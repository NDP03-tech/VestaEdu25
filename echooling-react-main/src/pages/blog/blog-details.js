import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Sử dụng useParams để lấy ID từ URL
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import BlogDetailsMain from './BlogDetailsMain';
import Breadcrumb from '../../components/Breadcrumb/BlogBreadcrumbs';
import ScrollToTop from '../../components/ScrollTop';
import Logo from '../../assets/images/logos/logo2.png';

const BlogDetails = () => {
    const { id } = useParams(); // Lấy ID từ URL
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPostDetails = async () => {
            if (!id) {
                setError("ID không hợp lệ");
                setLoading(false);
                return;
            }
        
            try {
                const response = await fetch(`/api/blog/${id}`); // Gọi API với id
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Không thể tải dữ liệu bài viết');
                }
                const data = await response.json();
                setPost(data);
            } catch (error) {
                console.error("Lỗi API:", error.message);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPostDetails();
    }, [id]);

    if (loading) return <div>⏳ Đang tải...</div>;
    if (error) return <div style={{ color: 'red' }}>❌ Lỗi: {error}</div>;
    if (!post) return <div>⚠️ Bài viết không tồn tại.</div>;

    return (
        <div className="course-single blog-post-page blog-post-single-page">
            <Header
                parentMenu="blog"
                menuCategoryEnable="enable"
                headerNormalLogo={Logo}
                headerStickyLogo={Logo}
            />

            <div className="react-wrapper">
                <div className="react-wrapper-inner">
                    <Breadcrumb
                        postTitle={post.title}
                        postImg={post.image}
                        postBannerImg={post.bannerImg}
                        postCategory={post.category}
                        postAuthor={post.author}
                        postAuthorImg={post.authorImg}
                        postPublishedDate={post.createdAt} // Sử dụng createdAt cho ngày xuất bản
                        postTotalView={post.totalView || 0} // Mặc định là 0 nếu không có
                    />

                    {/* Blog Main */}
                    <BlogDetailsMain 
                        postTitle={post.title}
                        postImg={post.image}
                        postBannerImg={post.bannerImg}
                        postAuthor={post.author}
                        postAuthorImg={post.authorImg}
                        postPublishedDate={post.createdAt} // Sử dụng createdAt
                        postTotalView={post.totalView || 0} // Mặc định là 0 nếu không có
                        postContent={post.content}
                    />
                    {/* Blog Main End */}

                    {/* Scroll To Top */}
                    <ScrollToTop />
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default BlogDetails;