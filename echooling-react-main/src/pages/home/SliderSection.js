import { useState } from 'react';
import ModalVideo from 'react-modal-video';
import { Link } from 'react-router-dom';
import Slider from "react-slick";
import './HomeSlider_centering.css'; // Import the centering styles

import sliderImg1 from "../../assets/images/slider/ẢNH COVER.jpg";
import sliderImg2 from "../../assets/images/slider/image.png";
import sliderImg11 from "../../assets/images/slider/11.jpg";
import sliderImg12 from "../../assets/images/slider/12.jpg";

const HomeSlider = () => {
    const [isOpen, setIsOpen] = useState(false);
    const openModal = () => setIsOpen(!isOpen);

    const sliderSettings = {
        dots: false,
        arrows: true,
        infinite: true,
        margin: 0,
        centerMode: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1200,   
                settings: {
                    arrows: true,
                }
            },
            {
                breakpoint: 767,
                settings: {
                    arrows: false,
                }
            }
        ]
    };

    return (
        <>
            <div className="react-slider-part">
                <ModalVideo channel='youtube' isOpen={isOpen} videoId='e5Hc2B50Z7c' onClose={() => { openModal(); }} />
                <div className="home-sliders home2">
                    <Slider {...sliderSettings}>
                        <div className="single-slide">
                            <div className="slider-img">
                                <img className="desktop" src={sliderImg1} alt="Slider Image 1" />
                                <img className="mobile" src={sliderImg11} alt="Slider Image 1" />
                            </div>
                                        
                        </div>
                        <div className="single-slide">
                            <div className="slider-img">
                                <img className="desktop" src={sliderImg2} alt="Slider Image 2" />
                                <img className="mobile" src={sliderImg12} alt="Slider Image 2" />
                            </div>
                            <div className="container">
                                <div className="slider-content">
                                    <div className="content-part">
                                        <span className="slider-pretitle wow animate__fadeInUp" data-wow-duration="1s">LỘ TRÌNH HỌC SIÊU TỐC</span>
                                        <h2 className="slider-title wow animate__fadeInUp" data-wow-duration="1s">
                                            Chúng tôi đồng hành<br />bạn quyết tâm
                                        </h2>
                                        <Link to="/course" className="react-btn-border">Đăng kí</Link>
                                    </div>
                                </div>

                            </div>                        
                        </div>
                    </Slider>
                </div>
            </div>
        </>
    );
}

export default HomeSlider;