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

  useEffect(() => {
    fetch(`${config.API_URL}/api/instructors/${id}`)
      .then((r) => r.json())
      .then((res) => {
        setInstructor(res.data || res.instructor || res);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    fetch(`${config.API_URL}/api/course`)
      .then((r) => r.json())
      .then((res) => {
        const d = res.data || res;
        setCourses(Array.isArray(d) ? d : []);
      })
      .catch((err) => console.error(err));
  }, []);

  if (loading)
    return (
      <div
        style={{
          textAlign: "center",
          padding: "120px 0",
          fontFamily: "DM Sans, sans-serif",
          color: "#a0a0a0",
        }}
      >
        Loading...
      </div>
    );
  if (!instructor) return <div>Instructor not found</div>;

  const avatarSrc = instructor?.image
    ? instructor.image.startsWith("http")
      ? instructor.image
      : `${config.API_URL}/uploads/${instructor.image}`
    : "/no-avatar.png";

  return (
    <div className="idm-page">
      <div className="idm-container">
        {/* ── Hero Card ── */}
        <div className="idm-hero-card">
          <div className="idm-hero-inner">
            {/* Left: Avatar */}
            <div className="idm-avatar-col">
              <img
                className="idm-avatar"
                src={avatarSrc}
                alt={instructor?.name}
              />
              <div className="idm-avatar-name">{instructor.name}</div>
              <div className="idm-avatar-designation">
                {instructor.designation}
              </div>

              {/* Contact */}
              <ul className="idm-contact-list">
                {instructor.phone && (
                  <li>
                    <PhoneOutlined /> {instructor.phone}
                  </li>
                )}
                {instructor.email && (
                  <li>
                    <MailOutlined /> {instructor.email}
                  </li>
                )}
              </ul>

              {/* Social */}
              {(instructor.facebook ||
                instructor.twitter ||
                instructor.linkedin) && (
                <div className="idm-social-row">
                  {instructor.facebook && (
                    <a
                      className="idm-social-btn"
                      href={instructor.facebook}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <FacebookFilled />
                    </a>
                  )}
                  {instructor.twitter && (
                    <a
                      className="idm-social-btn"
                      href={instructor.twitter}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <TwitterSquareFilled />
                    </a>
                  )}
                  {instructor.linkedin && (
                    <a
                      className="idm-social-btn"
                      href={instructor.linkedin}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <LinkedinFilled />
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Right: Info */}
            <div className="idm-info-col">
              {/* Bio */}
              <div>
                <div className="idm-section-label">
                  <span className="idm-section-label-line" />
                  <span className="idm-section-label-text">About</span>
                </div>
                <h2 className="idm-bio-title">Biography</h2>
                <div
                  className="idm-bio-content"
                  dangerouslySetInnerHTML={{ __html: instructor.bio || "" }}
                />
              </div>

              <div className="idm-divider" />

              {/* Counters */}
              {(instructor.studentComplete ||
                instructor.classesComplete ||
                instructor.studentsEnrolled) && (
                <div className="idm-counters">
                  {[
                    instructor.studentComplete || 0,
                    instructor.classesComplete || 0,
                    instructor.studentsEnrolled || 0,
                  ].map((num, i) => (
                    <div className="idm-counter-item" key={i}>
                      <img className="idm-counter-icon" src={icons[i]} alt="" />
                      <div className="idm-counter-number">
                        <VisibilitySensor
                          onChange={(v) => v && setState(false)}
                          delayedCall
                        >
                          <CountUp
                            start={state ? 0 : num}
                            end={num}
                            duration={2}
                          />
                        </VisibilitySensor>
                      </div>
                      <div className="idm-counter-label">{titles[i]}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Courses ── */}
        {courses.length > 0 && (
          <section className="idm-courses">
            <div className="idm-courses-header">
              <span className="idm-courses-line" />
              <h2 className="idm-courses-title">Teacher Courses</h2>
              <span className="idm-courses-line-right" />
            </div>

            <div className="idm-courses-grid">
              {courses.slice(0, 4).map((data) => {
                const imgSrc = data.image?.startsWith("http")
                  ? data.image
                  : `${config.API_URL}/uploads/${data.image}`;
                const authorSrc = data.authorImg?.startsWith("http")
                  ? data.authorImg
                  : `${config.API_URL}/uploads/${data.authorImg}`;
                return (
                  <Link
                    to={`/course/${data.id}`}
                    className="idm-course-card"
                    key={data.id}
                  >
                    <div className="idm-course-img-wrap">
                      <img
                        className="idm-course-img"
                        src={imgSrc}
                        alt={data.title}
                      />
                      {data.name && (
                        <span className="idm-course-badge">{data.name}</span>
                      )}
                    </div>
                    <div className="idm-course-body">
                      <div className="idm-course-title">{data.title}</div>
                      <div className="idm-course-author">
                        <img
                          className="idm-course-author-img"
                          src={authorSrc}
                          alt={data.author}
                        />
                        <span className="idm-course-author-name">
                          {data.author}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default InstructorDetailsMain;
