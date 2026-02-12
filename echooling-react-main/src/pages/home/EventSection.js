import React, { useEffect, useState } from 'react';
import Slider from "react-slick";
import axios from 'axios';

import SectionTitle from '../../components/SectionTitle';
import SingleEvent from '../../components/Event/SingleEvent.js'
import config from '../../config.js';
const Event = () => {
    const [events, setEvents] = useState([]);

    const eventSettings = {
        dots: true,
        arrows: false,
        infinite: false,
        centerMode: false,
        slidesToShow: 4,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1199,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 767,
                settings: {
                    slidesToShow: 1,
                    arrows: false,
                }
            }
        ]
    };

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get(`${config.API_URL}/api/events`);
                
                // Đảm bảo dữ liệu là mảng
                if (Array.isArray(response.data)) {
                    setEvents(response.data);
                } else {
                    setEvents([]);
                }
            } catch (error) {
                console.error('Failed to fetch events:', error);
                setEvents([]); // fallback để tránh lỗi render
            }
        };

        fetchEvents();
    }, []);

    return (
        <div className="react-upcoming__event blog__area">
            <div className="container">
                <SectionTitle Title="Upcoming Events" />
                <div className="event-slider wow animate__fadeInUp" data-wow-duration="0.3s">
                    <Slider {...eventSettings}>
                        {Array.isArray(events) && events.slice(0, 6).map((data) => (
                            <SingleEvent
                                key={data.id}
                                eventID={data.id}
                                eventImg={data.image}
                                eventBannerImg={data.bannerImg}
                                eventDayCount={data.dayCount}
                                eventDate={data.date}
                                eventStartTime={data.startTime}
                                eventEndTime={data.endTime}
                                eventCategory={data.category}
                                eventTitle={data.title}
                                eventBtnText="Find Out More"
                                eventLocation={data.location}
                            />
                        ))}
                    </Slider>
                </div>
            </div>
        </div>
    );
};

export default Event;
