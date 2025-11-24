import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import msly from "../../assets/images/instructors/msly.jpeg";
import EventRegisterModal from '../../components/ResigterForm/EventRegisterModal';

const EventDetailsMain = ({ event }) => {
    const [showRegisterModal, setShowRegisterModal] = useState(false);

    if (!event) return <div>Event not found</div>;

    const {
        _id: eventID,
        date: eventDate,
        startTime: eventStartTime,
        endTime: eventEndTime,
        location: eventLocation,
        cost: eventCost,
        host: eventHost,
        phone: eventContactNo,
        content: eventContent
    } = event;

    return (
        <div className="back__course__page_grid react-courses__single-page react-events__single-page pb---40 pt---120">
            <div className="container pb---70">
                <div className="row">
                    <div className="col-lg-8">
                        <div className="events-details">
                            <h3>About The Event</h3>
                            <div dangerouslySetInnerHTML={{ __html: eventContent }} />
                            <ul className="others-instructors">
                                <li>Người tổ chức sự kiện: {eventHost}</li>
                                <li>
                                    Đặt chỗ ngay hôm nay:  
                                    <a href="https://forms.gle/nTSLtEqaFXK3sGGJ8" target="_blank" rel="noopener noreferrer">
                                        Bấm vào đây
                                    </a>
                                </li>
                                <br />
                                <li>🌐 www.vestaedu.online</li>
                                <br />
                                <li>📞 {eventContactNo}</li>
                            </ul>
                            <img src={msly} alt="Ms. Ly" width="900" height="100" />
                        </div>
                    </div>
                    <div className="col-lg-4 md-mt-60">
                        <div className="react-sidebar react-back-course2 ml----30">                                                                        
                            <div className="widget get-back-course">                                       
                                <ul className="price__course">
                                    <li><i className="icon_ribbon_alt"></i> Cost: <b className="prs">{eventCost}</b></li>
                                    <li><i className="icon_profile"></i> Instructor: <b>{eventHost}</b></li>
                                </ul>
                                
                                <button
                                    className="start-btn"
                                    onClick={() => setShowRegisterModal(true)}
                                >
                                    Join Now!
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-right">
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                        <polyline points="12 5 19 12 12 19"></polyline>
                                    </svg>
                                </button>

                                <div className="share-course">
                                    <span>
                                        <Link to="#"><i aria-hidden="true" className="social_facebook"></i></Link>
                                        <Link to="#"><i aria-hidden="true" className="social_linkedin"></i></Link>
                                    </span>
                                </div>
                            </div> 
                            <div className="widget react-date-sec">
                                <ul className="recent-date">
                                    <li>Date: <b>{eventDate}</b></li>
                                    <li>Time: <b>{eventStartTime} - {eventEndTime}</b></li>
                                    <li>Venue: <b>{eventLocation}</b></li>
                                    <li>Phone: <b>{eventContactNo}</b></li>
                                </ul>
                            </div>                                
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal đăng ký sự kiện */}
            <EventRegisterModal
    open={showRegisterModal}
    onClose={() => setShowRegisterModal(false)}
    event={event}
/>
        </div>  
    );
};

export default EventDetailsMain;
