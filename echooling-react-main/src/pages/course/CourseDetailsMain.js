import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import RegisterForm from '../../components/ResigterForm/RegisterForm.js';
import config from '../../config.js'; 
const CourseDetailsMain = () => {
  const { id } = useParams();

  const courseId = id ? id.trim() : '';

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`${config.API_URL}/api/course/${courseId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch course data.");
        }
        const data = await response.json();
        setCourse(data);
      } catch (error) {
        console.error("Error fetching course data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    if (courseId) fetchCourse();
  }, [courseId]);

  const handleOpenForm = () => {
    setShowForm(true);
  };

  if (loading) return <p className="text-center mt-4">⏳ Loading course data...</p>;
  if (error) return <p className="text-center mt-4 text-danger">❌ {error}</p>;
  if (!course) return <p className="text-center mt-4 text-warning">⚠️ Course not found.</p>;

  const formattedEvents = course?.schedule?.map(date => ({
    title: "Scheduled Class",
    start: `${date}T00:00:00`,
    backgroundColor: "#ff5733",
    borderColor: "#ff5733",
    color: "#ff5733"
  })) || [];

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-lg-8">
          <Tabs>
            <div className="course-single-tab">
              <TabList className="nav nav-tabs">
                <Tab><button className="nav-link active">Description</button></Tab>
                <Tab><button className="nav-link">Schedule</button></Tab>
              </TabList>

              <div className="tab-content mt-3">
                <TabPanel>
                  <div className="tab-pane fade show active">
                    <h3 className="text-center">Course Overview</h3>
                    <p className="mt-3" dangerouslySetInnerHTML={{ __html: course?.content ?? "" }} />

                    <div className="text-center mt-4">
                      <img
                        src={course.image}
                        alt="Course"
                        className="img-fluid rounded shadow"
                        style={{ maxHeight: '400px', objectFit: 'cover' }}
                      />
                    </div>
                  </div>
                </TabPanel>
                <TabPanel>
                  <div className="tab-pane">
                    <h3 className="text-center">Class Schedule</h3>
                    <FullCalendar
                      plugins={[dayGridPlugin, listPlugin]}
                      initialView="dayGridMonth"
                      events={formattedEvents}
                      className="mt-4"
                    />
                  </div>
                </TabPanel>
              </div>
            </div>
          </Tabs>
        </div>

        <div className="col-lg-4">
          <div className="card p-4 shadow-sm">
            <h4 className="text-center">Course Information</h4>
            <ul className="list-group list-group-flush">
              <li className="list-group-item"><b>Instructor:</b> {course.author}</li>
              <li className="list-group-item"><b>Course Name:</b> {course.name}</li>
              <li className="list-group-item"><b>Duration:</b> {course.duration}</li>
              <li className="list-group-item"><b>Lessons:</b> {course.lesson} lessons</li>
              <li className="list-group-item"><b>Language:</b> {course.language}</li>
              <li className="list-group-item">
                <b>Tuition Fee:</b>{' '}
                <span className="text-danger">
                  {course.price ? `${course.price} VND` : "Free"}
                </span>
              </li>
            </ul>
            <button className="btn btn-primary mt-3 w-100" onClick={handleOpenForm}>
              Register Now
            </button>
          </div>
        </div>
      </div>

      {/* Register form modal */}
      {showForm && (
        <RegisterForm
          courseTitle={course.name}
          courseId={courseId}
          onClose={() => setShowForm(false)}
          open={showForm}
        />
      )}
    </div>
  );
};

export default CourseDetailsMain;
