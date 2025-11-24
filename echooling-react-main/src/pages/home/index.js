import logoImage from '../../assets/images/logos/1.jpg';
import React, { useState, useEffect } from 'react';
import HomeMain from './HomeMain';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import footerLogo from '../../assets/images/logos/logo-footer.png';

const HomePage = () => {
   
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [showPopup, setShowPopup] = useState(true);
    const [isBlinking, setIsBlinking] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleClosePopup = () => {
        setShowPopup(false);
    };
    const handleFreeTestClick = () => {
        setIsBlinking(true);
        setTimeout(() => {
            setIsBlinking(false);
        }, 1000);
        // Add your test link navigation here
        window.open('/test', '_blank');
    };

    const handleRegisterClick = () => {
        const registrationUrl = 'https://docs.google.com/forms/d/15ZawiHnB5qJTQZw-N-0-C8ChmHL7y6ELEJ4H7jzhGMM/viewform?edit_requested=true';
        window.open(registrationUrl, '_blank');
        handleClosePopup();
    };

    return (
        <>
            {showPopup && (
                <div style={{ 
                    position: 'fixed', 
                    top: 0, 
                    left: 0, 
                    right: 0, 
                    bottom: 0, 
                    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
                    zIndex: 40 
                }} />
            )}

            {showPopup && (
                <div 
                    style={{ 
                        position: 'fixed', 
                        top: 0, 
                        left: 0, 
                        right: 0, 
                        bottom: 0, 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        zIndex: 50,
                        padding: '15px'
                    }} 
                    onClick={handleClosePopup}
                >
                    <div style={{ 
                        backgroundColor: 'white', 
                        position: 'relative',
                        padding: '24px', 
                        borderRadius: '8px', 
                        boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)', 
                        maxWidth: '800px', 
                        width: '90%',
                        margin: isMobile ? '20px 0' : 'auto',
                        maxHeight: isMobile ? '90vh' : 'auto',
                        overflowY: isMobile ? 'auto' : 'visible'
                    }} onClick={(e) => e.stopPropagation()}>
                        {/* Add close button */}
                        <button 
                            style={{
                                position: 'absolute',
        top: isMobile ? '10px' : '-40px',
        right: isMobile ? '10px' : '-40px',
        backgroundColor: 'white',
        border: 'none',
        borderRadius: '50%',
        width: '36px',
        height: '36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#666',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        zIndex: 60
                            }}
                            onClick={handleClosePopup}
                        >
                            ×
                        </button>
                        <div style={{ 
                            display: 'flex', 
                            flexDirection: isMobile ? 'column' : 'row',
                            gap: '25px'
                        }}>
                            <div style={{ 
                                flex: isMobile ? 'none' : 1, 
                                paddingRight: isMobile ? '0' : '16px',
                                textAlign: 'center',
                                marginBottom: isMobile ? '20px' : '0',
                                 maxHeight: isMobile ? '300px' : 'auto',
                                overflowY: isMobile ? 'auto' : 'visible'
                            }}>
                                <h1 style={{ 
                                    fontSize: isMobile ? '1.5rem' : '1.8rem', 
                                    fontWeight: 'bold',
                                    marginBottom: '16px',
                                    color: '#333'
                                }}>Đăng Ký Ngay Để Nhận Ưu Đãi!</h1>
                                <div style={{ 
                                    width: '100%', 
                                    maxWidth: isMobile ? '200px' : '320px', 
                                    height: 'auto', 
                                   
                                    borderRadius: '8px', 
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', 
                                    margin: '0 auto' 
                                }}>
                                    <img 
                                        src={logoImage} 
                                        alt="Logo" 
                                        style={{ 
                                            width: '100%', 
                                            height: 'auto', 
                                            objectFit: 'cover',
                                            display: 'block'
                                        }} 
                                    />
                                </div>
                            </div>
                            <div style={{ 
                                flex: isMobile ? 'none' : 2,
                                paddingLeft: isMobile ? '0' : '16px',
                                width: isMobile ? '100%' : 'auto'
                            }}>
                                <form style={{ 
                                    display: 'flex', 
                                    flexDirection: 'column',
                                    width: '100%'
                                }}>
                                    <input 
                                        type="text" 
                                        placeholder="Họ và Tên" 
                                        required 
                                        style={{ 
                                            marginBottom: '8px', 
                                            padding: '12px', 
                                            border: '1px solid #ccc', 
                                            borderRadius: '4px',
                                            width: '100%',
                                            fontSize: isMobile ? '14px' : '16px'
                                        }} 
                                    />
                                    <input 
                                        type="email" 
                                        placeholder="Email" 
                                        required 
                                        style={{ 
                                            marginBottom: '8px', 
                                            padding: '12px', 
                                            border: '1px solid #ccc', 
                                            borderRadius: '4px',
                                            width: '100%',
                                            fontSize: isMobile ? '14px' : '16px'
                                        }} 
                                    />
                                    <input 
                                        type="tel" 
                                        placeholder="Số điện thoại" 
                                        required 
                                        style={{ 
                                            marginBottom: '16px', 
                                            padding: '12px', 
                                            border: '1px solid #ccc', 
                                            borderRadius: '4px',
                                            width: '100%',
                                            fontSize: isMobile ? '14px' : '16px'
                                        }} 
                                    />
                                </form>
                                <h3 style={{ 
                                    marginTop: '16px', 
                                    color: '#333',
                                    fontSize: isMobile ? '1.2rem' : '1.8rem'
                                    
                                }}>Những khóa học tiêu biểu:</h3>
                                <div style={{ 
                                    marginTop: '8px', 
                                    color: '#718096',
                                    fontSize: isMobile ? '0.9rem' : '1rem'
                                }}>
                                    {['5+', '6+', '7+'].map((level, index) => {
                                        const currentPrice = level === '5+' ? '8.400.000 VNĐ' : level === '6+' ? '12.000.000 VNĐ' : '15.000.000 VNĐ';
                                        const originalPrice = level === '5+' ? '12.000.000 VNĐ' : level === '6+' ? '16.000.000 VNĐ' : '18.000.000 VNĐ';

                                        return (
                                            <div key={index} style={{ 
                                                display: 'flex', 
                                                justifyContent: 'flex-start', 
                                                alignItems: 'center', 
                                                marginBottom: '4px',
                                                flexWrap: 'wrap'
                                            }}>
                                                <span style={{ marginRight: '10px' }}>IELTS {level}: {currentPrice}</span>
                                                <span style={{ textDecoration: 'line-through', color: '#f56565' }}>{originalPrice}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                                <h2 style={{ 
                                    marginTop: '16px', 
                                    color: '#333',
                                    fontSize: isMobile ? '1.2rem' : '1.4rem',
                                    fontSize: '28px'
                                }}>Và còn nhiều khóa học không thể bỏ lỡ!</h2>
                                <button 
                                    style={{ 
                                        marginTop: '20px', 
                                        marginRight:'20px',
                                        backgroundColor: '#3b82f6', 
                                        color: 'white', 
                                        padding: '12px 24px', 
                                        borderRadius: '8px', 
                                        transition: 'background-color 0.3s',
                                        width: isMobile ? '100%' : 'auto',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: isMobile ? '1rem' : '1.1rem',
                                        fontWeight: '600'
                                    }} 
                                    onClick={handleRegisterClick}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
                                >
                                    Đăng ký ngay!!!
                                </button>
                                <button 
        style={{ 
            marginTop: '20px', 
            marginRight:'20px',
            backgroundColor: '#3b82f6', 
            color: 'white', 
            padding: '12px 24px', 
            borderRadius: '8px', 
            transition: 'background-color 0.3s',
            width: isMobile ? '100%' : 'auto',
            border: 'none',
            cursor: 'pointer',
            fontSize: isMobile ? '1rem' : '1.1rem',
            fontWeight: '600'
        }}      
        onClick={handleFreeTestClick}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0284c7'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0ea5e9'}
    >
        Kiểm tra trình độ
    </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {!showPopup && <Header parentMenu='home' topbarEnable='enable' />}
            <HomeMain isDimmed={showPopup} />
            <Footer footerLogo={footerLogo} isDimmed={showPopup} />
        </>
    );
};

export default HomePage;