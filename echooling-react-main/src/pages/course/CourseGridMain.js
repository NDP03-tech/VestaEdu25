import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";
import SingleCourseThree from "../../components/Course/SingleCourseThree";
import "./CourseGridMain.css"; // Import file CSS để tùy chỉnh giao diện pagination
import config from '../../config';
const CourseGridMain = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [category, setCategory] = useState("All Categories");
    const [skill, setSkill] = useState("All Skills");
    const [sortBy, setSortBy] = useState("default");
    const [currentPage, setCurrentPage] = useState(0);
    const coursesPerPage = 6; // Số khóa học hiển thị mỗi trang

    // Gọi API lấy danh sách khóa học
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch(`${config.API_URL}/api/course`);
                if (!response.ok) {
                    throw new Error("Lỗi khi lấy danh sách khóa học");
                }
                const data = await response.json();
                setCourses(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    if (loading) return <div>Đang tải dữ liệu...</div>;
    if (error) return <div>Lỗi: {error}</div>;

    // Lấy danh sách các danh mục duy nhất từ dữ liệu khóa học
    const uniqueCategories = ["All Categories", ...new Set(courses.map(course => course.name))];

    const handleChangeCategory = (e) => {
        setCategory(e.target.value);
        setCurrentPage(0);
    };

    const handleChangeSkill = (e) => {
        setSkill(e.target.value);
        setCurrentPage(0);
    };

    const handleChangeSort = (e) => {
        setSortBy(e.target.value);
        setCurrentPage(0);
    };

    let filteredCourses = courses.filter(course => {
        return (category === "All Categories" || course.name === category) &&
               (skill === "All Skills" || course.type === skill);
    });

    if (sortBy === "lowToHigh") {
        filteredCourses.sort((a, b) => a.price - b.price);
    } else if (sortBy === "highToLow") {
        filteredCourses.sort((a, b) => b.price - a.price);
    }

    const pageCount = Math.ceil(filteredCourses.length / coursesPerPage);
    const offset = currentPage * coursesPerPage;
    const displayedCourses = filteredCourses.slice(offset, offset + coursesPerPage);

    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected);
        window.scrollTo(0, 0); // Cuộn lên đầu trang
    };

    return (
        <div className="react-course-filter back__course__page_grid pb---40 pt---110">
            <div className="container pb---70"> 
                <div className="row align-items-center back-vertical-middle shorting__course mb-50">
                    <div className="col-md-2">
                        <div className="all__icons"> 
                            <div className="list__icons">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-sliders">
                                    <line x1="4" y1="21" x2="4" y2="14"></line>
                                    <line x1="4" y1="10" x2="4" y2="3"></line>
                                    <line x1="12" y1="21" x2="12" y2="12"></line>
                                    <line x1="12" y1="8" x2="12" y2="3"></line>
                                    <line x1="20" y1="21" x2="20" y2="16"></line>
                                    <line x1="20" y1="12" x2="20" y2="3"></line>
                                    <line x1="1" y1="14" x2="7" y2="14"></line>
                                    <line x1="9" y1="8" x2="15" y2="8"></line>
                                    <line x1="17" y1="16" x2="23" y2="16"></line>
                                </svg>
                            </div>
                            <div className="result-count">Filters</div>
                        </div>
                    </div>
                    <div className="col-md-10 text-right">
                        <select className="from-control category" onChange={handleChangeCategory}>
                            {uniqueCategories.map((cat, index) => (
                                <option key={index} value={cat}>{cat}</option>
                            ))}
                        </select>
                        <select className="from-control skill" onChange={handleChangeSkill}>
                            <option value="All Skills">All Skills</option>
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Expert">Advanced</option>
                        </select>
                        <select className="from-control sort" onChange={handleChangeSort}>
                            <option value="default">Sort by: Default</option>
                            <option value="lowToHigh">Sort by price: low to high</option>
                            <option value="highToLow">Sort by price: high to low</option>
                        </select>
                    </div>
                </div>
                <div className="row"> 
                    {displayedCourses.map((data, index) => (
                        <div key={index} className="col-lg-4">
                            <SingleCourseThree
                                courseID={data.id} // Nếu backend dùng MongoDB, ID có thể là `_id`
                                courseImg={data.image}
                                courseTitle={data.title}
                                courseName={data.name}
                                courseAuthor={data.author}
                                courseType={data.type}
                                courseLesson={data.lesson}
                                courseDuration={data.duration}
                                courseEnrolled={data.enrolled}
                                coursePrice={data.price}
                                courseReview={data.review}
                                courseDis={data.dis}
                            />
                        </div>
                    ))}
                </div>
                <ReactPaginate
                    previousLabel={"←"}
                    nextLabel={"→"}
                    breakLabel={"..."}
                    pageCount={pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={3}
                    onPageChange={handlePageChange}
                    containerClassName={"pagination"}
                    activeClassName={"active"}
                />
            </div>
        </div>
    );
};

export default CourseGridMain;
