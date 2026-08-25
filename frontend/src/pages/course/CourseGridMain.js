import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import SingleCourseThree from "../../components/Course/SingleCourseThree";
import "./CourseGridMain.css";
import config from "../../config";

const CourseGridMain = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [category, setCategory] = useState("All Categories");
  const [skill, setSkill] = useState("All Skills");
  const [sortBy, setSortBy] = useState("default");
  const [currentPage, setCurrentPage] = useState(0);
  const coursesPerPage = 6;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`${config.API_URL}/api/course`);
        if (!response.ok) throw new Error("Không thể tải danh sách khóa học");
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

  if (loading)
    return (
      <div className="cgm-state-screen">
        <div className="cgm-spinner" />
        <p className="cgm-state-text">Đang tải khóa học…</p>
      </div>
    );

  if (error)
    return (
      <div className="cgm-state-screen">
        <span className="cgm-state-icon">✦</span>
        <p className="cgm-state-text cgm-state-error">Lỗi: {error}</p>
      </div>
    );

  const uniqueCategories = [
    "All Categories",
    ...new Set(courses.map((c) => c.name)),
  ];

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

  let filteredCourses = courses.filter(
    (course) =>
      (category === "All Categories" || course.name === category) &&
      (skill === "All Skills" || course.type === skill)
  );

  if (sortBy === "lowToHigh") filteredCourses.sort((a, b) => a.price - b.price);
  if (sortBy === "highToLow") filteredCourses.sort((a, b) => b.price - a.price);

  const pageCount = Math.ceil(filteredCourses.length / coursesPerPage);
  const offset = currentPage * coursesPerPage;
  const displayedCourses = filteredCourses.slice(
    offset,
    offset + coursesPerPage
  );

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="react-course-filter back__course__page_grid pb---40 pt---110">
      <div className="container pb---70">
        {/* ── Page Header ── */}
        <div className="cgm-page-header">
          <span className="cgm-header-eyebrow">Our Curriculum</span>
          <h1 className="cgm-page-title">Explore All Courses</h1>
          <div className="cgm-header-rule">
            <span />
            <span className="cgm-diamond">◆</span>
            <span />
          </div>
        </div>

        {/* ── Filter Bar ── */}
        <div className="row align-items-center cgm-filter-bar mb-50">
          {/* Left — label */}
          <div className="col-md-2">
            <div className="cgm-filter-label">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="4" y1="21" x2="4" y2="14" />
                <line x1="4" y1="10" x2="4" y2="3" />
                <line x1="12" y1="21" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12" y2="3" />
                <line x1="20" y1="21" x2="20" y2="16" />
                <line x1="20" y1="12" x2="20" y2="3" />
                <line x1="1" y1="14" x2="7" y2="14" />
                <line x1="9" y1="8" x2="15" y2="8" />
                <line x1="17" y1="16" x2="23" y2="16" />
              </svg>
              <span>Filters</span>
            </div>
          </div>

          {/* Right — selects */}
          <div className="col-md-8 cgm-filter-controls">
            <div className="cgm-select-wrap">
              <select className="cgm-select" onChange={handleChangeCategory}>
                {uniqueCategories.map((cat, i) => (
                  <option key={i} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <span className="cgm-select-arrow">▾</span>
            </div>

            <div className="cgm-select-wrap">
              <select className="cgm-select" onChange={handleChangeSkill}>
                <option value="All Skills">All Skills</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Expert">Advanced</option>
              </select>
              <span className="cgm-select-arrow">▾</span>
            </div>

            <div className="cgm-select-wrap">
              <select className="cgm-select" onChange={handleChangeSort}>
                <option value="default">Sort: Default</option>
                <option value="lowToHigh">Price: Low → High</option>
                <option value="highToLow">Price: High → Low</option>
              </select>
              <span className="cgm-select-arrow">▾</span>
            </div>
          </div>

          {/* Result count pill */}
          <div className="col-md-2 text-right">
            <div className="cgm-result-pill">
              {filteredCourses.length} <span>courses</span>
            </div>
          </div>
        </div>

        {/* ── Course Grid ── */}
        {displayedCourses.length === 0 ? (
          <div className="cgm-empty">
            <span className="cgm-empty-icon">◇</span>
            <p>No courses match your filters.</p>
          </div>
        ) : (
          <div className="row cgm-grid">
            {displayedCourses.map((data, index) => (
              <div
                key={data.id || index}
                className="col-lg-4 cgm-card-col"
                style={{ animationDelay: `${index * 0.07}s` }}
              >
                <SingleCourseThree
                  courseID={data.id}
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
        )}

        {/* ── Pagination ── */}
        {pageCount > 1 && (
          <div className="cgm-pagination-wrap">
            <ReactPaginate
              previousLabel={"←"}
              nextLabel={"→"}
              breakLabel={"···"}
              pageCount={pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={3}
              onPageChange={handlePageChange}
              containerClassName={"cgm-pagination"}
              activeClassName={"active"}
              disabledClassName={"disabled"}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseGridMain;
