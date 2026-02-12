import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import config from "../../config";
const InstructorMain = () => {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  fetch(`${config.API_URL}/api/instructors`)
    .then((res) => res.json())
    .then((res) => {
      setInstructors(res.data);   // 🔥 quan trọng
      setLoading(false);
    })
    .catch((err) => {
      console.error(err);
      setLoading(false);
    });
}, []);


  if (loading) return <div className="text-center pt-5">Loading...</div>;

  return (
    <div className="instructors___page pt---120 pb---140">
      <div className="container pb---60">
        <div className="row">
          {instructors.slice(0, 8).map((data) => (
            <div className="col-lg-3" key={data.id}>
              <div className="instructor__content">
                <div className="instructor__image">
                  <img
                    src={
                      data.image?.startsWith("http")
                        ? data.image
                        : `${config.API_URL}/uploads/${data.image}`
                    }
                    alt={data.name}
                  />

                  <div className="content__hover">
                    <p>{data.bio}</p>
                    <ul>
                      {data.facebook && (
                        <li>
                          <a href={data.facebook} target="_blank" rel="noreferrer">
                            <span className="social_facebook"></span>
                          </a>
                        </li>
                      )}

                      {data.twitter && (
                        <li>
                          <a href={data.twitter} target="_blank" rel="noreferrer">
                            <span className="social_twitter"></span>
                          </a>
                        </li>
                      )}

                      {data.linkedin && (
                        <li>
                          <a href={data.linkedin} target="_blank" rel="noreferrer">
                            <span className="social_linkedin"></span>
                          </a>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>

                <div className="bottom-content">
                  <h4>
                    <Link to={`/instructor/${data.id}`}>{data.name}</Link>
                  </h4>
                  <p>{data.designation}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InstructorMain;
