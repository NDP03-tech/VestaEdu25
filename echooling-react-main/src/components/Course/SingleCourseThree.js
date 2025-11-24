import React from 'react';
import { Link } from 'react-router-dom';
import './SingleCourseThree.css';
import defaultImage from '../../assets/images/course/1.png'; // Ảnh mặc định

const SingleCourseThree = (props) => {
    const { 
        itemClass, 
        courseID, 
        courseImg, 
        courseTitle, 
        courseAuthor, 
        courseLesson, 
        coursePrice, 
        courseDuration, 
        courseReview, 
        courseDis 
    } = props;

    // Kiểm tra nếu courseImg từ API có hợp lệ không
    const imageUrl = courseImg?.startsWith("http") ? courseImg : `https://res.cloudinary.com/dubzoozqi/image/upload/${courseImg}`;

    console.log("Ảnh từ API:", imageUrl);

    return (
        <div className={itemClass ? itemClass : 'single-studies grid-item'}>
            <div className="inner-course">
                <div className="case-img">
                    <img src={imageUrl || defaultImage} alt={courseTitle || "Khóa học"} />
                </div>
                <div className="case-content"> 
                    <h4 className="case-title">
                        <Link to={`/course/${courseID}`}>{courseTitle || "Khóa học không có tiêu đề"}</Link>
                    </h4> 
                    <ul className="meta-course">
                        <li>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                            </svg> {courseLesson} Bài học
                        </li>
                        <li>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                            </svg> {courseDuration}
                        </li>
                        <li>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg> {courseAuthor}
                        </li>
                    </ul>

                    {/* Phần đánh giá (được giữ nguyên từ code cũ) */}
                    <ul className="react-ratings">
                        <li className="react-book"> 
                            <em>{courseReview || 5}</em>  
                            <span className="icon_star"></span> 
                            <span className="icon_star"></span> 
                            <span className="icon_star"></span> 
                        </li>
                    </ul>

                    <ul className="d-flex justify-content-between align-items-center">
                        <li className="priceDis">{courseDis || "N/A"} </li>
                        <li className="price">{coursePrice || "Miễn phí"} </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default SingleCourseThree;
