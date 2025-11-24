import React from 'react';
import { Link } from 'react-router-dom';

const Breadcrumb = ({
    eventBannerImg,
    eventCategory,
    eventDate,
    eventStartTime,
    eventEndTime,
    eventTitle,
    eventLocation
}) => {
    return (
        <div
            style={{
                position: 'relative',
                backgroundImage: `url(${eventBannerImg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '400px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                textAlign: 'center',
                padding: '0 1rem'
            }}
        >
            {/* Lớp phủ tối */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    zIndex: 1
                }}
            />

            {/* Nội dung chữ */}
            <div style={{ position: 'relative', zIndex: 2 }}>
                <Link to="#" style={{
                    display: 'inline-block',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    padding: '0.3rem 0.8rem',
                    borderRadius: '5px',
                    color: 'white',
                    textDecoration: 'none',
                    marginBottom: '10px',
                    fontWeight: '500'
                }}>
                    {eventCategory}
                </Link>

                <h1 style={{ fontSize: '2.5rem', margin: '0.5rem 0' }}>{eventTitle}</h1>

                <ul style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '1.5rem',
                    fontSize: '1rem'
                }}>
                    <li>📅 {eventDate?.slice(0, 10)}</li>
                    <li>⏰ {eventStartTime} - {eventEndTime}</li>
                    <li>📍 {eventLocation}</li>
                </ul>
            </div>
        </div>
    );
};

export default Breadcrumb;
