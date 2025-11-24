import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Breadcrumb from '../../components/Breadcrumb';
import LoginMain from './LoginMain';
import ScrollToTop from '../../components/ScrollTop';
import Logo from '../../assets/images/logos/logo2.png';

const Login = ({ onLogin, setIsLoggedIn }) => {
    const handleLogin = () => {
        // Logic để xử lý khi người dùng đăng nhập thành công
        console.log('User logged in successfully');
    };

    return (
        <>
            <Header
                parentMenu='page'
                menuCategoryEnable='enable'
                headerNormalLogo={Logo}
                headerStickyLogo={Logo}
            />

            <div className="react-wrapper">
                <div className="react-wrapper-inner">
                    <Breadcrumb
                        pageTitle="Login"
                    />

<LoginMain onLogin={handleLogin} setIsLoggedIn={setIsLoggedIn} />

                    {/* scrolltop-start */}
                    <ScrollToTop />
                    {/* scrolltop-end */}
                </div>
            </div>

            <Footer />
        </>
    );
}

export default Login;