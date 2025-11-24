import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Breadcrumb from '../../components/Breadcrumb/EventBreadcrumbs';
import EventDetailsMain from './EventDetailsMain';
import ScrollToTop from '../../components/ScrollTop';
import Logo from '../../assets/images/logos/logo2.png';

const EventDetails = () => {
    const location = useLocation();
    const eventID = location.pathname.split('/')[2];
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await axios.get(`/api/events/${eventID}`);
                setEvent(response.data);
            } catch (err) {
                console.error('Error fetching event:', err);
                setError('Failed to fetch event data');
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [eventID]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!event) return <div>Event not found</div>;

    return (
        <>
            <Header
                parentMenu='event'
                menuCategoryEnable='enable'
                headerNormalLogo={Logo}
                headerStickyLogo={Logo}
            />

            <div className="react-wrapper">
                <div className="react-wrapper-inner">
                <Breadcrumb
    eventID={event.id}
    eventImg={event.image}
    eventBannerImg={event.bannerImg}
    eventDayCount={event.dayCount}
    eventDate={event.date}
    eventStartTime={event.startTime}
    eventEndTime={event.endTime}
    eventCategory={event.category}
    eventTitle={event.title}
    eventBtnText="Find Out More"
    eventContent={event.content}
    eventLocation={event.location}
/>



                    {/* Truyền toàn bộ event xuống */}
                    <EventDetailsMain event={event} />

                    <ScrollToTop />
                </div>
            </div>

            <Footer />
        </>
    );
};

export default EventDetails;
