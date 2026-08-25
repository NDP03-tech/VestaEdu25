import React from 'react';


import infoImg1 from '../../assets/images/contact/2.png'
import infoImg2 from '../../assets/images/contact/3.png'
import infoImg3 from '../../assets/images/contact/4.png'

const ContactInfo = (props) => {
    const { contactBoxClass } = props;
    return (
        <ul className="address-sec">
            <li>
                <em className="icon"><img src={infoImg1} alt="image" /></em>
                <span className="text"><em>Address</em> Ecopark</span>
            </li>
            <li>
                <em className="icon"><img src={infoImg2} alt="image" /></em>
                <span className="text"><em>Contact</em> <a href="#">Mobile: (+84) 83 511 3688</a><br/><a>Zalo:(+84) 838779988</a><br/> <a>Mail:  info@vestaedu.online</a></span>
            </li>
            <li>
                <em className="icon"><img src={infoImg3} alt="image" /></em>
                <span className="text"><em>Hour of operation</em> Monday - Sunday: 09:00 - 23:00 </span>
            </li>
        </ul>
    );

}

export default ContactInfo;