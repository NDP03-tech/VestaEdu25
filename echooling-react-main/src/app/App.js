import React, { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Preloader from "../components/Preloader";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import AdminLayout from "../pages/admin/AdminLayout";

// Custom Components
import HomeMain from "../pages/home/HomeMain.js";
import About from "../pages/about";
import AssignedQuizzes from "../pages/user/AssignedQuizzes";
import Course from "../pages/course";
import Dashbroad from "../pages/admin";
import CourseDetails from "../pages/course/course-details";
import Instructor from "../pages/instructor";
import InstructorDetails from "../pages/instructor/instructor-details";
import Event from "../pages/event";
import EventSidebar from "../pages/event/event-sidebar";
import EventDetails from "../pages/event/event-details";
import Blog from "../pages/blog";
import BlogDetails from "../pages/blog/blog-details";
import Login from "../pages/authentication/login";
import UserManagement from "../pages/admin/userManagement";
import Contact from "../pages/contact";
import Error from "../pages/404";
import UserDashboard from "../pages/user/UserDashbroad";
import LoadTop from "../components/ScrollTop/LoadTop";
import AdminCourses from "../pages/Admin2/Course";
import UserTestComponent from "../pages/baitest/UserTestComponent";
import AdminBlog from "../pages/Admin2/Blog";
import AdminInstructor from "../pages/Admin2/Instructor";
import AdminEvent from "../pages/Admin2/Event";
import QuizManage from "../pages/QuizManage";
import Classes from "../pages/Classes.js";
import QuizPreview from "../components/QuizPreview.js";
import EditQuiz from "../pages/EditQuiz";
import QuizBuilder from "../components/QuizBuilder.jsx";
import CategoryPage from "../pages/CategoryPage";
import ClassDetail from "../pages/ClassDetails";
import AdminRoute from "../components/ProtectedRoute/AdminRoute";
import UserRoute from "../components/ProtectedRoute/UserRoute";
import GradesPage from "../pages/GradesPage";
import QuizPreviewWrapper from "../pages/QuizPreviewWrapper.js";
import QuizAnswerTable from "../components/QuizAnswerTable";
import QuizResultTable from "../components/QuizAnswerTable.js"; // ✅ THÊM IMPORT MỚI
import ResultsStatsPage from "../components/User/ResultsStatsPage";
import UserLayout from "../components/User/UserLayout";

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(undefined); // undefined ban đầu để tránh nhấp nháy

  useEffect(() => {
    const checkLogin = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    checkLogin();

    // Lắng nghe thay đổi token giữa các tab
    window.addEventListener("storage", checkLogin);

    return () => {
      window.removeEventListener("storage", checkLogin);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    console.log("User logged in:", true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    console.log("User logged out:", false);
  };

  return (
    <div className="App">
      {isLoading ? <Preloader /> : ""}
      <>
        <LoadTop />
        <Routes>
          {/* Public Routes */}
          <Route path="/" exact element={<HomeMain />} />
          <Route
            path="/login"
            element={
              <Login onLogin={handleLogin} setIsLoggedIn={setIsLoggedIn} />
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/course" element={<Course />} />
          <Route path="/test" element={<UserTestComponent />} />
          <Route path="/course/:id" element={<CourseDetails />} />
          <Route path="/event" element={<Event />} />
          <Route path="/event/:id" element={<EventDetails />} />
          <Route path="/event-sidebar" element={<EventSidebar />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogDetails />} />
          <Route path="/instructor" element={<Instructor />} />
          <Route path="/instructor/:id" element={<InstructorDetails />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/answer/:quizId" element={<QuizAnswerTable />} />

          {/* Shared Protected Route for doing quiz (admin & user) */}
          <Route element={<ProtectedRoute isLoggedIn={isLoggedIn} />}>
            <Route
              path="/user/do-quiz/:quizId"
              element={<QuizPreviewWrapper />}
            />
          </Route>

          {/* Admin Protected Routes */}
          <Route element={<AdminRoute isLoggedIn={isLoggedIn} />}>
            <Route
              path="/admin"
              element={
                <AdminLayout
                  onLogout={handleLogout}
                  setIsLoggedIn={setIsLoggedIn}
                />
              }
            >
              <Route index element={<Dashbroad />} />
              <Route path="dashboard" element={<Dashbroad />} />
              <Route path="adminUser" element={<UserManagement />} />
              <Route path="adminEvent" element={<AdminEvent />} />
              <Route path="adminBlog" element={<AdminBlog />} />
              <Route path="instructors" element={<AdminInstructor />} />
              <Route path="adminCourse" element={<AdminCourses />} />
              <Route path="grades/:userId" element={<GradesPage />} />

              {/* ✅ THÊM ROUTE MỚI - Chi tiết kết quả quiz của user */}
              <Route
                path="results/user/:userId/quiz/:quizId"
                element={<QuizResultTable />}
              />

              <Route path="quiz-manage" element={<QuizManage />} />
              <Route path="quiz-preview/:id" element={<QuizPreview />} />
              <Route path="preview/:quizId" element={<QuizPreviewWrapper />} />
              <Route path="quizzes/:id/edit" element={<EditQuiz />} />
              <Route path="quiz-builder/:quizId" element={<QuizBuilder />} />
              <Route path="categories" element={<CategoryPage />} />
              <Route path="classes" element={<Classes />} />
              <Route path="class/:id" element={<ClassDetail />} />
            </Route>
          </Route>

          {/* User Protected Routes */}
          <Route element={<UserRoute isLoggedIn={isLoggedIn} />}>
            <Route path="/user" element={<UserLayout />}>
              <Route index element={<UserDashboard />} />
              <Route path="quizzes" element={<AssignedQuizzes />} />
              <Route path="results" element={<ResultsStatsPage />} />
            </Route>
          </Route>

          {/* 404 fallback */}
          <Route path="*" element={<Error />} />
        </Routes>
      </>
    </div>
  );
};

export default App;
