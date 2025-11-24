import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import SectionTitle from '../../components/SectionTitle';
import SingleCourseThreeCustom from '../../components/Course/SingleCourseThreeCustom';
import axios from 'axios';

const itemsPerPage = 3;

const Course = () => {
    const [courses, setCourses] = useState([]); // Dữ liệu từ API
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await axios.get('/api/course/');
                // Đảm bảo luôn là mảng
                setCourses(Array.isArray(res.data) ? res.data : []);
            } catch (err) {
                console.error('Lỗi khi lấy danh sách khoá học:', err);
                setCourses([]); // fallback
            } finally {
                setLoading(false);
            }
        };
    
        fetchCourses();
    }, []);
    

    const offset = currentPage * itemsPerPage;
    const displayedCourses = courses.slice(offset, offset + itemsPerPage);

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    if (loading) return <div className="text-center">Đang tải khoá học...</div>;

    return (
        <div className="popular__course__area pt---100 pb---100">
            <div className="container">
                <SectionTitle Title="Các khoá học" />

                <div className="row">
                    {displayedCourses.map((data, index) => (
                        <div key={index} className="col-lg-4 col-md-6 col-sm-12">
                            <SingleCourseThreeCustom
                                courseID={data.id}
                                courseImg={data.image}
                                courseTitle={data.title}
                                courseName={data.name}
                                courseLesson={data.lesson}
                                coursePrice={data.price}
                                courseDis={data.dis}
                                courseAuthor={data.author}
                                courseDuration={data.duration}
                                courseSchedule={data.schedule}
                            />
                        </div>
                    ))}
                </div>

                {/* Phân trang */}
                <div className="pagination-container text-center mt-4">
                    <ReactPaginate
                        previousLabel={'←'}
                        nextLabel={'→'}
                        breakLabel={'...'}
                        pageCount={Math.ceil(courses.length / itemsPerPage)}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={3}
                        onPageChange={handlePageClick}
                        containerClassName={'pagination'}
                        activeClassName={'active'}
                    />
                </div>

                <div className="text-center mt-4">
                    <Link to="/course" className="view-courses">
                        View All Courses{' '}
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                             viewBox="0 0 24 24" fill="none" stroke="currentColor"
                             strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Course;
