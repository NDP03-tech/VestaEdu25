import logoImage from '../../assets/images/logos/1.jpg';
import React, { useState, useEffect } from 'react';
import HomeMain from './HomeMain';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import footerLogo from '../../assets/images/logos/logo-footer.png';

const HomePage = () => {
   
    const [screenSize, setScreenSize] = useState({
        width: window.innerWidth,
        isMobile: window.innerWidth <= 768,
        isTablet: window.innerWidth > 768 && window.innerWidth <= 1024,
        isDesktop: window.innerWidth > 1024
    });
    const [showPopup, setShowPopup] = useState(true);
    const [isBlinking, setIsBlinking] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setScreenSize({
                width,
                isMobile: width <= 768,
                isTablet: width > 768 && width <= 1024,
                isDesktop: width > 1024
            });
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
        window.open('/test', '_blank');
    };

    const handleRegisterClick = () => {
        const registrationUrl = 'https://docs.google.com/forms/d/15ZawiHnB5qJTQZw-N-0-C8ChmHL7y6ELEJ4H7jzhGMM/viewform?edit_requested=true';
        window.open(registrationUrl, '_blank');
        handleClosePopup();
    };

    // Responsive styles based on screen size
    const getResponsiveStyles = () => {
        const { isMobile, isTablet, isDesktop } = screenSize;

        return {
            modalContainer: {
                backgroundColor: 'white',
                position: 'relative',
                padding: isMobile ? '20px' : isTablet ? '28px' : '32px',
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
                maxWidth: isMobile ? '95%' : isTablet ? '720px' : '900px',
                width: '90%',
                margin: 'auto',
                maxHeight: isMobile ? '90vh' : isTablet ? '85vh' : '90vh',
                overflowY: 'auto'
            },
            closeButton: {
                position: 'absolute',
                top: isMobile ? '10px' : '-40px',
                right: isMobile ? '10px' : '-40px',
                backgroundColor: 'white',
                border: 'none',
                borderRadius: '50%',
                width: isMobile ? '32px' : '40px',
                height: isMobile ? '32px' : '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: isMobile ? '18px' : '24px',
                fontWeight: 'bold',
                color: '#666',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                zIndex: 60,
                transition: 'all 0.2s'
            },
            contentWrapper: {
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                gap: isMobile ? '20px' : isTablet ? '25px' : '30px',
                alignItems: isMobile ? 'center' : 'flex-start'
            },
            leftSection: {
                flex: isMobile ? 'none' : isTablet ? 1 : 1,
                width: isMobile ? '100%' : 'auto',
                paddingRight: isMobile ? '0' : '16px',
                textAlign: 'center',
                marginBottom: isMobile ? '20px' : '0'
            },
            rightSection: {
                flex: isMobile ? 'none' : isTablet ? 1.5 : 2,
                width: isMobile ? '100%' : 'auto',
                paddingLeft: isMobile ? '0' : '16px'
            },
            title: {
                fontSize: isMobile ? '1.4rem' : isTablet ? '1.6rem' : '2rem',
                fontWeight: 'bold',
                marginBottom: isMobile ? '12px' : '16px',
                color: '#333',
                lineHeight: '1.3'
            },
            logoWrapper: {
                width: '100%',
                maxWidth: isMobile ? '220px' : isTablet ? '280px' : '340px',
                height: 'auto',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                margin: '0 auto',
                overflow: 'hidden'
            },
            input: {
                marginBottom: '10px',
                padding: isMobile ? '10px' : isTablet ? '12px' : '14px',
                border: '1px solid #ccc',
                borderRadius: '6px',
                width: '100%',
                fontSize: isMobile ? '14px' : isTablet ? '15px' : '16px',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box'
            },
            sectionTitle: {
                marginTop: isMobile ? '12px' : '16px',
                marginBottom: '8px',
                color: '#333',
                fontSize: isMobile ? '1.1rem' : isTablet ? '1.3rem' : '1.5rem',
                fontWeight: '600'
            },
            courseList: {
                marginTop: '8px',
                color: '#718096',
                fontSize: isMobile ? '0.85rem' : isTablet ? '0.95rem' : '1rem'
            },
            courseItem: {
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                marginBottom: '6px',
                flexWrap: 'wrap',
                gap: '8px'
            },
            finalMessage: {
                marginTop: '16px',
                color: '#333',
                fontSize: isMobile ? '1.1rem' : isTablet ? '1.2rem' : '1.4rem',
                fontWeight: '600',
                lineHeight: '1.4'
            },
            buttonContainer: {
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                gap: '12px',
                marginTop: '20px'
            },
            button: {
                backgroundColor: '#3b82f6',
                color: 'white',
                padding: isMobile ? '12px 20px' : isTablet ? '13px 24px' : '14px 28px',
                borderRadius: '8px',
                transition: 'all 0.3s',
                width: isMobile ? '100%' : 'auto',
                border: 'none',
                cursor: 'pointer',
                fontSize: isMobile ? '0.95rem' : isTablet ? '1rem' : '1.1rem',
                fontWeight: '600',
                whiteSpace: 'nowrap'
            },
            testButton: {
                backgroundColor: '#0ea5e9'
            }
        };
    };

    const styles = getResponsiveStyles();
    const { isMobile } = screenSize;

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
                    <div style={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
                        {/* Close button */}
                        <button 
                            style={styles.closeButton}
                            onClick={handleClosePopup}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#f3f4f6';
                                e.currentTarget.style.transform = 'scale(1.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'white';
                                e.currentTarget.style.transform = 'scale(1)';
                            }}
                        >
                            ×
                        </button>

                        <div style={styles.contentWrapper}>
                            {/* Left Section - Logo */}
                            <div style={styles.leftSection}>
                                <h1 style={styles.title}>
                                    Đăng Ký Ngay Để Nhận Ưu Đãi!
                                </h1>
                                <div style={styles.logoWrapper}>
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

                            {/* Right Section - Form & Info */}
                            <div style={styles.rightSection}>
                                <form style={{ 
                                    display: 'flex', 
                                    flexDirection: 'column',
                                    width: '100%'
                                }}>
                                    <input 
                                        type="text" 
                                        placeholder="Họ và Tên" 
                                        required 
                                        style={styles.input}
                                        onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
                                        onBlur={(e) => e.currentTarget.style.borderColor = '#ccc'}
                                    />
                                    <input 
                                        type="email" 
                                        placeholder="Email" 
                                        required 
                                        style={styles.input}
                                        onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
                                        onBlur={(e) => e.currentTarget.style.borderColor = '#ccc'}
                                    />
                                    <input 
                                        type="tel" 
                                        placeholder="Số điện thoại" 
                                        required 
                                        style={styles.input}
                                        onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
                                        onBlur={(e) => e.currentTarget.style.borderColor = '#ccc'}
                                    />
                                </form>

                                <h3 style={styles.sectionTitle}>
                                    Những khóa học tiêu biểu:
                                </h3>
                                <div style={styles.courseList}>
                                    {['5+', '6+', '7+'].map((level, index) => {
                                        const currentPrice = level === '5+' ? '8.400.000 VNĐ' : level === '6+' ? '12.000.000 VNĐ' : '15.000.000 VNĐ';
                                        const originalPrice = level === '5+' ? '12.000.000 VNĐ' : level === '6+' ? '16.000.000 VNĐ' : '18.000.000 VNĐ';

                                        return (
                                            <div key={index} style={styles.courseItem}>
                                                <span style={{ fontWeight: '500' }}>
                                                    IELTS {level}: {currentPrice}
                                                </span>
                                                <span style={{ 
                                                    textDecoration: 'line-through', 
                                                    color: '#f56565',
                                                    fontSize: '0.9em'
                                                }}>
                                                    {originalPrice}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>

                                <h2 style={styles.finalMessage}>
                                    Và còn nhiều khóa học không thể bỏ lỡ!
                                </h2>

                                <div style={styles.buttonContainer}>
                                    <button 
                                        style={styles.button}
                                        onClick={handleRegisterClick}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = '#1d4ed8';
                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = '#3b82f6';
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = 'none';
                                        }}
                                    >
                                        Đăng ký ngay!!!
                                    </button>
                                    <button 
                                        style={{...styles.button, ...styles.testButton}}
                                        onClick={handleFreeTestClick}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = '#0284c7';
                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(14, 165, 233, 0.4)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = '#0ea5e9';
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = 'none';
                                        }}
                                    >
                                        Kiểm tra trình độ
                                    </button>
                                </div>
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