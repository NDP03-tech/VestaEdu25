import React from 'react';
import BlogMain from './BlogMain';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Breadcrumb from '../../components/Breadcrumb';
import ScrollToTop from '../../components/ScrollTop';

import Logo from '../../assets/images/logos/logo2.png';

const Blog = () => {
    return (
        <div className="blog-post-page">
            <Header
                parentMenu="blog"
                menuCategoryEnable="enable"
                headerNormalLogo={Logo}
                headerStickyLogo={Logo}
            />

            <div className="react-wrapper">
                <div className="react-wrapper-inner">
                    <Breadcrumb pageTitle="Blog" />

                    {/* Thêm khoảng cách giữa Breadcrumb và BlogMain */}
                    <div className="mt-4"> {/* Thay đổi giá trị margin-top theo ý muốn */}
                        <BlogMain />
                    </div>

                    {/* scrolltop-start */}
                    <ScrollToTop />
                    {/* scrolltop-end */}
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default Blog;