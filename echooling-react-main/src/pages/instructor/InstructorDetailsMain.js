import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import CountUp from "react-countup";
import VisibilitySensor from "react-visibility-sensor";

import {
  FacebookFilled,
  TwitterSquareFilled,
  LinkedinFilled,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";

import "./InstructorDetailsMain.css";
import countIcon1 from "../../assets/images/profile/2.png";
import countIcon2 from "../../assets/images/profile/3.png";
import countIcon3 from "../../assets/images/profile/4.png";
import config from "../../config";

const InstructorDetailsMain = () => {
  const { id } = useParams();

  const [instructor, setInstructor] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState(true);

  const icons = [countIcon1, countIcon2, countIcon3];
  const titles = ["Student complete", "Classes complete", "Students enrolled"];

  // =========================
  // FETCH INSTRUCTOR
  // =========================
  useEffect(() => {
    fetch(`${config.API_URL}/api/instructors/${id}`)
      .then((res) => res.json())
      .then((res) => {
        const data = res.data || res.instructor || res;
        setInstructor(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  // =========================
  // FETCH COURSES
  // =========================
  useEffect(() => {
    fetch(`${config.API_URL}/api/course`)
      .then((res) => res.json())
      .then((res) => {
        const data = res.data || res;
        setCourses(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.error(err));
  }, []);

  if (loading) return <div className="text-center pt-5">Loading...</div>;
  if (!instructor) return <div>Instructor not found</div>;

  return (
    <div className="profile-top back__course__area pt-5 pb-5">
      <div className="container">
        <div className="row">
          {/* IMAGE */}
          <div className="col-lg-4">
            <img
              className="img-fluid rounded mb-3 large-image"
              src={
                instructor?.image
                  ? instructor.image.startsWith("http")
                    ? instructor.image
                    : `${config.API_URL}/uploads/${instructor.image}`
                  : "/no-avatar.png"
              }
              alt={instructor?.name}
            />
          </div>

          {/* INFO */}
          <div className="col-lg-8">
            <ul className="list-unstyled">
              <li className="mb-2">
                <b>Name:</b> <em>{instructor.name}</em>
              </li>

              <li className="mb-2">
                Job Title: <em>{instructor.designation}</em>
              </li>

              {instructor.phone && (
                <li className="mb-2">
                  <PhoneOutlined /> <em>{instructor.phone}</em>
                </li>
              )}

              {instructor.email && (
                <li className="mb-2">
                  <MailOutlined /> <em>{instructor.email}</em>
                </li>
              )}

              {/* SOCIAL LINKS */}
              {(instructor.facebook ||
                instructor.twitter ||
                instructor.linkedin) && (
                <li className="mb-2">
                  <div style={{ display: "flex", gap: 14, marginTop: 6 }}>
                    {instructor.facebook && (
                      <a
                        href={instructor.facebook}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <FacebookFilled
                          style={{ fontSize: 22, color: "#1877f2" }}
                        />
                      </a>
                    )}

                    {instructor.twitter && (
                      <a
                        href={instructor.twitter}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <TwitterSquareFilled
                          style={{ fontSize: 22, color: "#1da1f2" }}
                        />
                      </a>
                    )}

                    {instructor.linkedin && (
                      <a
                        href={instructor.linkedin}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <LinkedinFilled
                          style={{ fontSize: 22, color: "#0a66c2" }}
                        />
                      </a>
                    )}
                  </div>
                </li>
              )}
            </ul>

            {/* BIO */}
            <h3 className="text-primary">Biography</h3>
            <div
              dangerouslySetInnerHTML={{
                __html: instructor.bio || "",
              }}
            />

            {/* COUNTERS */}
            {(instructor.studentComplete ||
              instructor.classesComplete ||
              instructor.studentsEnrolled) && (
              <div className="count__area2">
                <ul className="row">
                  {[
                    instructor.studentComplete || 0,
                    instructor.classesComplete || 0,
                    instructor.studentsEnrolled || 0,
                  ].map((num, index) => (
                    <li key={index} className="col-lg-4">
                      <div className="count__content text-center">
                        <div className="icon mb-2">
                          <img src={icons[index]} alt="" />
                        </div>

                        <div className="text">
                          <VisibilitySensor
                            onChange={(isVisible) =>
                              isVisible && setState(false)
                            }
                            delayedCall
                          >
                            <CountUp
                              start={state ? 0 : num}
                              end={num}
                              duration={2}
                            />
                          </VisibilitySensor>

                          <p>{titles[index]}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* COURSES */}
            <h2 className="teacher__course">Teacher Courses</h2>

            <div className="react-course-filter related__course">
              <div className="row">
                {courses.slice(0, 4).map((data) => (
                  <div className="single-studies col-lg-6 mb-5" key={data.id}>
                    <div className="inner-course">
                      <div className="case-img">
                        <Link to={`/course/${data.id}`} className="cate-w">
                          {data.name}
                        </Link>

                        <img
                          src={
                            data.image?.startsWith("http")
                              ? data.image
                              : `${config.API_URL}/uploads/${data.image}`
                          }
                          alt={data.title}
                          className="img-fluid"
                        />
                      </div>

                      <div className="case-content">
                        <h4 className="case-title">
                          <Link to={`/course/${data.id}`}>{data.title}</Link>
                        </h4>

                        <div className="react__user">
                          <img
                            src={
                              data.authorImg?.startsWith("http")
                                ? data.authorImg
                                : `${config.API_URL}/uploads/${data.authorImg}`
                            }
                            alt={data.author}
                          />{" "}
                          {data.author}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* END COURSES */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorDetailsMain;
