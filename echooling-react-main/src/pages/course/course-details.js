import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // ✅ Sử dụng useParams()
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Breadcrumb from '../../components/Breadcrumb/CourseBreadcrumbs';
import CourseDetailsMain from './CourseDetailsMain';
import ScrollToTop from '../../components/ScrollTop';
import Logo from '../../assets/images/logos/logo2.png';
import config from '../../config';
const CourseDetails = () => {
    const { id } = useParams(); 
    const courseID = id ? id.trim() : ''; // ✅ Xử lý ID tránh lỗi khoảng trắng hoặc xuống dòng

    console.log("Course ID:", courseID); // ✅ Kiểm tra giá trị ID

    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!courseID ) {  // 
            setError("ID không hợp lệ");
            setLoading(false);
            return;
        }

        const fetchCourseDetails = async () => {
            try {
                const response = await fetch(`${config.API_URL}/api/course/${courseID}`);
                if (!response.ok) {
                    const errorData = await response.json(); // ✅ Lấy thông tin lỗi từ backend
                    throw new Error(errorData.message || 'Không thể tải dữ liệu khóa học');
                }
                const data = await response.json();
                setCourse(data);
            } catch (error) {
                // Chỉ kiểm tra courseID có tồn tại, không kiểm tra độ dài 24 ký tự nữa
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCourseDetails();
    }, [courseID]);

    if (loading) return <div>⏳ Đang tải...</div>;
    if (error) return <div style={{ color: 'red' }}>❌ Lỗi: {error}</div>;
    if (!course) return <div>⚠️ Khóa học không tồn tại.</div>;

    return (
        <div className="course-single">
            <Header
                parentMenu='course'
                menuCategoryEnable='enable'
                headerNormalLogo={Logo}
                headerStickyLogo={Logo}
            />

            <div className="react-wrapper">
                <div className="react-wrapper-inner">
                    <Breadcrumb
                        courseBannerImg={course.bannerImg}
                        courseTitle={course.title}
                        courseName={course.name}
                        courseAuthor={course.author}
                        courseAuthorImg={course.authorImg}
                        courseLesson={course.lesson}
                    />

                    <CourseDetailsMain
                        courseID={course.id}  // ✅ Đảm bảo ID đúng
                        courseImg={course.image}
                        courseTitle={course.title}
                        courseName={course.name}
                        courseAuthor={course.author}
                        courseAuthorImg={course.authorImg}
                        courseLesson={course.lesson}
                        courseDuration={course.duration}
                        coursePrice={course.price}
                        courseLanguage={course.language}
                        courseContent={course.content}
                        courseSchedule={course.schedule} 
                    />

                    {/* scrolltop-start */}
                    <ScrollToTop />
                    {/* scrolltop-end */}
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default CourseDetails;
