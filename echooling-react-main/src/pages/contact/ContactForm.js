import React from 'react';
import emailjs from 'emailjs-com';

const ContactForm = () => {
    function sendEmail(e) {
        e.preventDefault();

        emailjs.sendForm(
            'service_addy4sj',  // Thay thế bằng service ID
            'template_ff0z4pb', // Thay thế bằng template ID
            e.target,
            'gY_asaAKpxmYdIg29'  // Thay thế bằng public key (user ID)
        )
        .then((result) => {
            console.log("Email sent successfully:", result.text);
            alert("Your message has been sent successfully!");
        })
        .catch((error) => {
            console.error("Error sending email:", error.text);
            alert("Failed to send message. Please try again later.");
        });

        e.target.reset();
    } 

    return (
        <div className="react-blog-form">
            <h2 className="contact-title">Questions? <br/> Feel free to contact us.</h2>
            <div className="blog-form">
                <form id="contact-form" onSubmit={sendEmail}>                                                    
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="back-input">
                                <input type="text" name="user_name" required placeholder="Name" />
                            </div>
                        </div>

                        <div className="col-lg-6 pdl-5">
                            <div className="back-input">
                                <input type="email" name="user_email" required placeholder="Email" />                          
                            </div>
                        </div>
                        
                        <div className="col-lg-6">
                            <div className="back-input">
                                <input type="text" name="user_subject" required placeholder="Subject" />                          
                            </div>
                        </div>

                        <div className="col-lg-6 pdl-5">
                            <div className="back-input">
                                <input type="text" name="user_phone" required placeholder="Phone" />                   
                            </div>
                        </div>

                        <div className="col-lg-12">
                            <div className="back-textarea">
                                <textarea name="user_message" required placeholder="Message"></textarea>
                            </div>
                        </div>

                        <div className="col-lg-12">                                                
                            <button type="submit" className="back-btn">Send Message</button>
                        </div>
                    </div>                                                    
                </form>
            </div>
        </div>
    );
}

export default ContactForm;
