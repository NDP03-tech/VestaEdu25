import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import CountUp from "react-countup";
import VisibilitySensor from "react-visibility-sensor";

import instructors from "../../data/Instructors.json";
import "./InstructorDetailsMain.css";
import countIcon1 from "../../assets/images/profile/2.png";
import countIcon2 from "../../assets/images/profile/3.png";
import countIcon3 from "../../assets/images/profile/4.png";
import config from "../../config";
const InstructorDetailsMain = () => {
  const location = useLocation();
  const postURL = location.pathname.split("/");
  const instructor = instructors.find((b) => b.id === Number(postURL[2]));

  const [state, setState] = useState(true);
  const [courses, setCourses] = useState([]);

  const icons = [countIcon1, countIcon2, countIcon3];
  const titles = ["Student complete", "Classes complete", "Students enrolled"];

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`${config.API_URL}/api/course/`);
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error("Lỗi khi lấy khóa học:", error);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="profile-top back__course__area pt-5 pb-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-4">
            <img
              className="img-fluid rounded mb-3 large-image"
              src={require(`../../assets/images/instructors/${instructor.image}`)}
              alt={instructor.name}
            />
          </div>
          <div className="col-lg-8">
            <ul className="list-unstyled">
              <li className="mb-2">
                <span className="fw-bold">Name:</span>{" "}
                <em>{instructor.name}</em>
              </li>
              <li className="mb-2">
                Job Title: <em>{instructor.designation}</em>
              </li>
              <li className="mb-2">
                Phone: <em>{instructor.phone}</em>
              </li>
              <li className="mb-2">
                Email: <em>{instructor.email}</em>
              </li>
            </ul>
            <h3 className="text-primary">Biography</h3>
            <p
              dangerouslySetInnerHTML={{
                __html: instructor.bio.replace(/\n/g, "<br />"),
              }}
            />

            {/* Counters */}
            {instructor.counters && (
              <div className="count__area2">
                <ul className="row">
                  {instructor.counters.map((counter, index) => {
                    const countNum = Object.values(counter)[0];
                    return (
                      <li key={index} className="col-lg-4">
                        <div className="count__content text-center">
                          <div className="icon mb-2">
                            <img src={icons[index]} alt={`Icon ${index + 1}`} />
                          </div>
                          <div className="text">
                            <VisibilitySensor
                              onChange={(isVisible) =>
                                isVisible && setState(false)
                              }
                              delayedCall
                            >
                              <CountUp
                                start={state ? 0 : countNum}
                                end={countNum}
                                duration={10}
                              />
                            </VisibilitySensor>
                            <em>{counter.countSubtext}</em>
                            <p>{titles[index]}</p>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {/* Courses */}
            <h2 className="teacher__course">Teacher Courses</h2>
            <div className="react-course-filter related__course">
              <div className="row">
                {courses.slice(0, 4).map((data) => (
                  <div className="single-studies col-lg-6 mb-5" key={data.id}>
                    <div className="inner-course">
                      <div className="case-img">
                        <Link to="#" className="cate-w">
                          {data.name}
                        </Link>
                        <img
                          src={
                            data.image.startsWith("http")
                              ? data.image
                              : require(`../../assets/images/course/${data.image}`)
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
                              data.authorImg.startsWith("http")
                                ? data.authorImg
                                : require(`../../assets/images/course/${data.authorImg}`)
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorDetailsMain;
