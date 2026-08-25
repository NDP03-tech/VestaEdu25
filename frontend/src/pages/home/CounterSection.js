import React, { useState, useEffect, useRef } from "react";
import CountUp from 'react-countup';

const Counter = () => {
    const [viewed, setViewed] = useState(false);
    const counterRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setViewed(true);
                    observer.disconnect(); // Chỉ chạy một lần
                }
            },
            { threshold: 0.5 } // Ít nhất 50% phần tử xuất hiện thì kích hoạt
        );

        if (counterRef.current) {
            observer.observe(counterRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const counters = [
        { countNum: 1478, countTitle: 'Successfully Trained', counterSubtext: 'ENROLLED LEARNERS' },
        { countNum: 1731, countTitle: 'Available Courses', counterSubtext: 'COUNTRYWIDE AWARDS' },
        { countNum: 280, countTitle: 'Scheduled Events', counterSubtext: 'SUCCESS EVENTS' },
        { countNum: 1045, countTitle: 'Getting Featured on', counterSubtext: 'ONLINE COURSES' }
    ];

    return (
        <div className="count__area pb---110">
            <div className="container count__width">
                <div className="row">
                    <div className="col-xxl-11 col-xl-11 col-lg-11 offset-lg-1">
                        <div className="row">
                            {counters.map((counter, num) => (
                                <div key={num} className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 wow animate__fadeInUp" data-wow-duration="0.3s">
                                    <div className="count__content" ref={counterRef}>
                                        <p className="count__content--paragraph">{counter.countTitle}</p>
                                        <h3 className="count__content--title-1 counter">
                                            <span>
                                                <CountUp start={0} end={viewed ? counter.countNum : 0} duration={2} />
                                            </span>
                                        </h3>
                                        <p className="count__content--paragraph2">{counter.counterSubtext}</p>                                            
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Counter;
