import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import instructors from '../../data/Instructors.json';
import './InstructorSection.css'

const Instructor = () => {
    const navigate = useNavigate();

    return (
        <div className="instructor__area pt---0 pb---110 text-center">
            <div className="container">
                <div className="row d-flex align-items-center justify-content-between">
                    <div className="col-lg-6 col-md-4 col-sm-6">
                        <div className="instructor__content instructor__content-one d-flex align-items-center">
                            <div className="instructors_lefts">
                                <h6 className="wow animate__fadeInUp" data-wow-duration="0.3s">Course Instructors</h6>
                                <h2 className="wow animate__fadeInUp" data-wow-duration="0.5s">
                                    Meet our <br /> Class Instructors
                                </h2>
                            </div>
                            <button
                                onClick={() => navigate('/instructor')}
                                className="view-all-btn"
                            >
                                View All
                                <span className="arrow">➜</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="row">
                    {instructors.slice(8, 14).map((data) => (
                        <div key={data.id} className="col-xxl-3 col-xl-3 col-lg-3 col-md-4 col-sm-6">
                            <div className="instructor__content">
                                <div className="instructor__content-1">
                                    <img src={require(`../../assets/images/instructor/${data.image}`)} alt={data.title} />
                                </div>
                                <div className="instructor__content-2">
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
}

export default Instructor;
