import React  from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Breadcrumb from '../../components/Breadcrumb';
import EventSidebarMain from './EventSidebarMain';
import ScrollToTop from '../../components/ScrollTop';


const EventSidebar = () => {

    return (
        <>
            <Header
                parentMenu='event'
            />

            <div className="react-wrapper">
                <div className="react-wrapper-inner">
                    <Breadcrumb
                        pageTitle="Event Sidebar"
                    />

                    <EventSidebarMain />

                    {/* scrolltop-start */}
                    <ScrollToTop />
                    {/* scrolltop-end */}
                </div>
            </div>

            <Footer />

        </>
    );
}

export default EventSidebar;