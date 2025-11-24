import { Link } from 'react-router-dom';

// Image
import aboutImg from '../../assets/images/about/ab.png';
import aboutBadge from '../../assets/images/logos/logo-footer.png';

const About = () => {

    return (
        <div className="about__area about__area_one p-relative pt---10 pb---120">
            <div className="container">                        
                <div className="row">
                    <div className="col-lg-6">
                        <div className="about__image">
                            <img src={aboutImg} alt="About" />
                            <div 
                                style={{ 
                                    position: "absolute", // Cố định vị trí theo phần tử cha
                                    top: "50%", // Đưa về giữa theo chiều dọc
                                    left: "50%", // Đưa về giữa theo chiều ngang
                                    transform: "translate(-90%, -100%)", // Căn chỉnh chính xác
                                    width: "100px", 
                                    height: "100px", 
                                    borderRadius: "50%", 
                                    backgroundColor: "#0A1F50", // Màu xanh nhạt
                                    display: "flex", 
                                    justifyContent: "center", 
                                    alignItems: "center", 
                                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                                    zIndex: 30 // Đảm bảo hiển thị trên cùng
                                }}
                            >
                                <img 
                                    src={aboutBadge} 
                                    alt="Shape Image" 
                                    style={{ width: "80%", height: "80%", borderRadius: "50%", objectFit: "cover" }} 
                                />
                            </div>
                        
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="about__content">
                            <h2 className="about__title wow animate__fadeInUp" data-wow-duration="0.3s">Welcome to <br/> <em>VESTA ACADEMY</em></h2>
                            <p className="about__paragraph wow animate__fadeInUp" data-wow-duration="0.5s"><em>Giáo dục không chỉ là việc truyền đạt kiến thức, mà còn là hành trình khám phá tri thức và chắp cánh ước mơ.</em></p>
                            <p className="wow animate__fadeInUp" data-wow-duration="0.6s"><em>Tại đây, chúng tôi cam kết mang đến những bài học đầy cảm hứng, giúp bạn mở rộng tầm nhìn và chuẩn bị cho tương lai thành công.</em></p>
                            <ul className="wow animate__fadeInUp" data-wow-duration="0.9s">
                                <li><Link to="/about" className="more-about"> Read More <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-right"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></Link></li>
                                <li className="last-li">
                                    <em>Get Support</em>
                                    <Link to="mailto: info@vestaedu.online"> info@vestaedu.online</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default About;