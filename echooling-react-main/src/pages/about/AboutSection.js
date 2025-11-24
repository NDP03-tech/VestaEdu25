import React from 'react';
import aboutImg from '../../assets/images/about/ab.png';
import shapeImg from '../../assets/images/logos/logo-footer.png';

const AboutPart = () => {
    return (
        <div style={{ position: "relative", paddingTop: "100px", paddingBottom: "120px" }}>
            <div style={{ width: "80%", margin: "0 auto" }}>
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center" }}>
                    
                    <div style={{ flex: "1", textAlign: "center" }}>
                        <div>
                            <img src={aboutImg} alt="About" style={{ width: "100%", maxWidth: "650px" }} />
                            <div 
    style={{ 
        position: "absolute", // Cố định vị trí theo phần tử cha
        top: "50%", // Đưa về giữa theo chiều dọc
        left: "50%", // Đưa về giữa theo chiều ngang
        transform: "translate(-120%, -400%)", // Căn chỉnh chính xác
        width: "100px", 
        height: "100px", 
        borderRadius: "50%", 
        backgroundColor: "#0A1F50", // Màu xanh nhạt
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        zIndex: 9999 // Đảm bảo hiển thị trên cùng
    }}
>
    <img 
        src={shapeImg} 
        alt="Shape Image" 
        style={{ width: "80%", height: "80%", borderRadius: "50%", objectFit: "cover" }} 
    />
</div>

                        </div>
                    </div>

                    <div style={{ flex: "1", padding: "20px" }}>
                        <div>
                            <h2 style={{ fontSize: "32px", fontWeight: "bold" }}>
                                Welcome to <br/> <em>VESTA ACADEMY</em>
                            </h2>
                            <p style={{ fontStyle: "italic", fontSize: "18px" }}>
                                Giáo dục không chỉ là việc truyền đạt kiến thức, mà còn là hành trình khám phá tri thức và chắp cánh ước mơ.
                            </p>
                            <p style={{ fontStyle: "italic", fontSize: "18px" }}>
                                Tại đây, chúng tôi cam kết mang đến những bài học đầy cảm hứng, giúp bạn mở rộng tầm nhìn và chuẩn bị cho tương lai thành công.
                            </p>

                            <ul style={{ marginTop: "20px", listStyleType: "none", padding: 0 }}>
                                <li style={{ fontSize: "18px", fontStyle: "italic" }}>
                                    <strong>Get Support:</strong> <a href="mailto: info@vestaedu.online"> info@vestaedu.online</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div style={{
                    marginTop: "50px",
                    backgroundColor: "#f3f4f6",
                    padding: "24px",
                    borderRadius: "10px",
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)"
                }}>
                    <h3 
                        style={{
                            textAlign: "center",
                            background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            fontWeight: 'bold',
                            fontSize: '2rem',
                            marginTop: '24px',
                            marginBottom: '16px',
                        }}
                    >
                        About VESTA ACADEMY
                    </h3>

                    <p style={{ color: "#333", fontSize: "18px", lineHeight: "1.6" }}>
                        <strong>1. Hành trình ra đời:</strong><br />
                        <strong>Vesta Academy</strong> được sáng lập bởi Thạc sĩ <strong>Lê Hương Ly</strong>, một nhà giáo dục tận tâm với 14 năm kinh nghiệm giảng dạy tiếng Anh chuyên sâu. <br />
                        Từng đảm nhận vai trò giám khảo hỏi thi nói Cambridge (<strong>KET, PET</strong>), giảng viên tại <strong>Đại học Ngoại ngữ – ĐHQGHN (ULIS)</strong>, và giáo viên tại các ngôi trường danh giá như <strong>Hà Nội - Amsterdam</strong> và <strong>Greenfield School</strong> (hệ Cambridge). <br /><br />

                        <strong>2. Tầm nhìn & Sứ mệnh:</strong><br />
                        <strong>Tầm nhìn:</strong><br />
                        - Kiến tạo một cộng đồng học thuật nơi mọi học viên, bất kể xuất phát điểm, đều có thể tiến bộ vượt bậc và tự tin bước ra thế giới.<br />
                        - <strong>Vesta Academy</strong> hướng tới việc phát triển giáo dục bền vững, thúc đẩy bình đẳng giới, đồng thời đóng góp vào sự đổi mới của đất nước thông qua tri thức.<br /><br />

                        <strong>Sứ mệnh:</strong> <em>“Không có học sinh kém, chỉ là chưa biết đường.”</em><br />
                        - Chúng tôi tin rằng mọi học viên đều sở hữu tiềm năng vô hạn, và với phương pháp đúng đắn cùng sự đồng hành tận tâm, họ sẽ biến giấc mơ thành hiện thực.<br /><br />

                        <strong>3. Chiến lược triển khai:</strong><br />
                        - <strong>Lộ trình cá nhân hóa:</strong> Mỗi học viên được thiết kế chương trình học riêng, đảm bảo tiến bộ rõ rệt trong thời gian ngắn.<br />
                        - <strong>Ôn luyện hằng ngày:</strong> Với bài tập bắt buộc mỗi ngày và kiểm tra từ vựng liên tục, chúng tôi giúp học viên nắm chắc kiến thức.<br />
                        - <strong>Cam kết đầu ra:</strong> Chỉ <strong>4 tháng/khóa</strong>, học viên tăng ít nhất <strong>1-2 band IELTS</strong>; trong <strong>1 năm</strong>, từ số 0 có thể đạt <strong>IELTS 7.0</strong>.<br /><br />
                    </p>
                </div>
            </div>
        </div>
    );
}

export default AboutPart;
