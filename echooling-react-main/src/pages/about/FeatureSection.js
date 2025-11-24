import React from 'react';
import { Link } from 'react-router-dom';
import icon1 from '../../assets/images/topics/icon.png';
import icon2 from '../../assets/images/topics/icon2.png';
import icon3 from '../../assets/images/topics/icon3.png';

const Feature = () => {
    return (
        <div className="react_populars_topics react_populars_topics2 react_populars_topics_about pb---80">
            <div className="react__title__section react__title__section-all">
                <div className="row">
                    <div className="col-md-12 text-center">
                        <h3 
                            style={{
                                background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                fontWeight: 'bold',
                                fontFamily: 'sans-serif',
                                fontSize: '2rem',
                                marginTop: '0px',
                                marginBottom: '20px',
                                
                            }}
                            className="react__tittle wow animate__fadeInUp"
                            data-wow-duration="0.5s"
                        >
                            USP / ĐIỂM MẠNH
                        </h3>
                    </div>                                
                </div>                            
            </div>
            <div className="container">      
                <div className="row pt---30">
                    <div className="col-md-4 wow animate__fadeInUp" data-wow-duration="0.3s">
                        <div className="item__inner">                                    
                            <div className="icon">
                                <img src={icon1} alt="Icon image" />
                            </div>
                            <div className="react-content">
                                <h3 className="react-title"><a href="courses-grid.html">Đội ngũ giảng viên chất lượng</a></h3>
                                <p>Founder: Thạc sĩ Lê Hương Ly – cựu giám khảo Cambridge, IELTS Speaking 9.0, 14 năm kinh nghiệm, từng huấn luyện đội tuyển Ams.</p>
                                <p>Phương pháp độc quyền: Học viên được “ốp sát” hằng ngày qua bài tập, kiểm tra, và chữa bài chi tiết, đảm bảo học gì chắc nấy.</p>
                            </div>                                    
                        </div>
                    </div>
                    <div className="col-md-4 wow animate__fadeInUp" data-wow-duration="0.5s">
                        <div className="item__inner">                                    
                            <div className="icon">
                                <img src={icon2} alt="Icon image" />
                            </div>
                            <div className="react-content">
                                <h3 className="react-title"><a href="courses-grid.html">Lộ trình học tập cá nhân hóa</a></h3>
                                <p>Lộ trình cá nhân hóa: 4 tháng/khóa để tăng band, 1 năm đạt IELTS 7.0 từ con số 0 – một lộ trình khoa học và tối ưu.</p>
                                <p>Giáo viên và trợ giảng tận tâm, kết hợp công nghệ Hybrid (online + offline) để hỗ trợ học viên mọi lúc, mọi nơi.</p>
                            </div>                                    
                        </div>
                    </div>
                    <div className="col-md-4 wow animate__fadeInUp" data-wow-duration="0.7s">
                        <div className="item__inner">                                    
                            <div className="icon">
                                <img src={icon3} alt="Icon image" />
                            </div>
                            <div className="react-content">
                                <h3 className="react-title"><a href="courses-grid.html">Cam kết chất lượng và hỗ trợ</a></h3>
                                <p>Đầu ra minh bạch: Kiểm tra giữa kỳ, cuối kỳ, giám sát tiến độ chặt chẽ.</p>
                                <p>Học nhanh – Thi chắc: Với sự quyết tâm của học viên và sự đồng hành của Vesta, mục tiêu luôn trong tầm tay.</p>
                                <p>Hỗ trợ bền vững: Tài liệu phong phú, lớp bù cho học sinh yếu, học bổng cho hoàn cảnh khó khăn.</p>
                            </div>                                    
                        </div>
                    </div>  
                </div>
            </div>
        </div>
    );
}

export default Feature;
