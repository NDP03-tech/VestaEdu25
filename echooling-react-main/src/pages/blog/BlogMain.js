import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import './BlogMain.css'; // Import CSS file

const BlogMain = () => {
    const itemsPerPage = 4; // Số bài viết mỗi trang
    const [currentPage, setCurrentPage] = useState(0);
    const [posts, setPosts] = useState([]); // State để lưu bài viết
    const [loading, setLoading] = useState(true); // State để theo dõi trạng thái tải
    const [error, setError] = useState(null); // State để lưu lỗi

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch('/api/blog'); // Thay đổi URL API theo backend của bạn
                if (!response.ok) {
                    throw new Error('Đã xảy ra lỗi khi lấy dữ liệu');
                }
                const data = await response.json();
                setPosts(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    // Tính toán index của bài viết hiển thị
    const offset = currentPage * itemsPerPage;
    const currentPosts = posts.slice(offset, offset + itemsPerPage);
    const pageCount = Math.ceil(posts.length / itemsPerPage);

    // Xử lý khi chuyển trang
    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
        window.scrollTo(0, 0);
    };

    if (loading) {
        return <div>Loading...</div>; // Hiển thị khi đang tải
    }

    if (error) {
        return <div>Error: {error}</div>; // Hiển thị lỗi nếu có
    }

    return (
        <div className="react-blog-page pb-40 pt-110">
            <div className="container pb-70">
                <div className="row">
                    {currentPosts.map((data, index) => (
                        data.id ? (
                            <div key={index} className="col-lg-6 mb-4">
                                <div className="single-blog h-100 shadow-effect">
                                    <div className="inner-blog d-flex flex-column h-100">
                                        <div className="blog-img">
                                            <Link to={`/blog/${data.id}`} className="cate">{data.category}</Link>
                                            <img src={data.image} alt={data.title} className="img-fluid" />
                                        </div>
                                        <div className="blog-content mt-auto p-3 rounded shadow-sm">
                                            <h3 className="blog-title text-center mb-3">
                                                <Link to={`/blog/${data.id}`} className="text-decoration-none text-dark">{data.title}</Link>
                                            </h3>
                                            <p className="blog-desc mb-3">{data.description}</p>
                                            <div className="d-flex justify-content-center mb-3">
                                                <Link to={`/blog/${data.id}`} className="blog-btn btn btn-primary">Read More</Link>
                                            </div>
                                            <ul className="top-part list-unstyled d-flex justify-content-between align-items-center">
                                                <li className="me-3">
                                                    <small className="fw-bold fs-5">Tác giả: {data.author}</small>
                                                </li>
                                                <li className="date-part">
                                                    <small className="fw-bold fs-5">{data.publishedDate}</small>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : null
                    ))}
                </div>

                {/* Phân trang */}
                <ReactPaginate
                    previousLabel={"←"}
                    nextLabel={"→"}
                    breakLabel={"..."}
                    pageCount={pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={3}
                    onPageChange={handlePageClick}
                    containerClassName={"pagination justify-content-center"}
                    activeClassName={"active"}
                    previousClassName={"page-item"}
                    nextClassName={"page-item"}
                    pageClassName={"page-item"}
                    pageLinkClassName={"page-link"}
                    previousLinkClassName={"page-link"}
                    nextLinkClassName={"page-link"}
                />
            </div>
        </div>
    );
};

export default BlogMain;