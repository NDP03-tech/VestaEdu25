import React  from 'react';
import { Link } from 'react-router-dom';

import SingleEventTwo from '../../components/Event/SingleEventTwo';


import img from '../../assets/images/related-course/1.jpg'
import events from '../../data/Events.json';

const EventSidebarMain = () => {

    return (
        <div className="react-upcoming__event react-upcoming__event_list blog__area pt-90 pb-120">
            <div className="container">  
                <div className="row">
                    <div className="col-lg-8">
                        <div className="row align-items-center back-vertical-middle shorting__course3 mb-50">
                            <div className="col-md-6">
                            </div>
                        </div>                      
                        <div className="row">
                            {events.map((data, index) => {
                                return (
                                    <div className="col-lg-4">
                                        <SingleEventTwo
                                            eventID= {data.id}
                                            eventImg= {data.image}
                                            eventDayCount= {data.dayCount}
                                            eventDate= {data.date}
                                            eventTitle= {data.title}
                                            eventLocation= {data.location}
                                            eventContent= {data.content}
                                        />
                                    </div>
                                )
                            }).slice(0, 9)}                                  
                        </div>  
                        
                        <ul className="back-pagination pt---20">
                            <li><Link to="#">1</Link></li>
                            <li><Link to="#">2</Link></li>
                            <li className="back-next"><Link to="#"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-right"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></Link></li>
                        </ul>
                    </div>
                    <div className="col-lg-4">
                        <div className="react-sidebar react-sidebar-event ml----30">
                            <div className="widget back-post blog-form">
                                <h3 className="widget-title">Find events</h3>
                                <form id="contact-form">
                                    <div className="event-input">
                                        <input id="name" type="text" name="name" placeholder="Event from" />
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-calendar"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                    </div>                                            
                                    <div className="search-form">
                                        <input type="text" name="input" placeholder="Search..." />
                                        <button> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-search"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg> </button>
                                    </div>                                                
                                    <div className="location-input">
                                        <input id="subject" type="text" name="subject" placeholder="Location" />  
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-map-pin"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>                                
                                    </div>                                             
                                </form>
                            </div>
                            <div className="widget back-post">
                                <h3 className="widget-title">Popular Events</h3>
                                <ul className="related-courses">
                                    {events.map((data, index) => {
                                        return (
                                            <li>
                                                <Link to={`/event/${data.id}`}><span className="post-images"><img src={require(`../../assets/images/event/${data.image}`)} alt="post" /></span></Link>
                                                <div className="titles">                                                    
                                                    <h4><Link to={`/event/${data.id}`}>{data.title}</Link></h4>
                                                    <span>{data.dayCount} {data.date}</span>
                                                </div>
                                            </li>
                                        )
                                    }).slice(10, 12)}                                           
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>                                            
            </div>
        </div> 
    );
}

export default EventSidebarMain;