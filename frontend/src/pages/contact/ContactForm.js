import React, { useState } from "react";
import emailjs from "emailjs-com";

const ContactForm = () => {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  function sendEmail(e) {
    e.preventDefault();
    setSending(true);

    emailjs
      .sendForm(
        "service_addy4sj",
        "template_ff0z4pb",
        e.target,
        "gY_asaAKpxmYdIg29",
      )
      .then(() => {
        setSent(true);
        setSending(false);
        e.target.reset();
        setTimeout(() => setSent(false), 4000);
      })
      .catch((error) => {
        console.error("Error:", error.text);
        setSending(false);
        alert("Failed to send message. Please try again later.");
      });
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

        .cf-wrap {
          font-family: 'DM Sans', sans-serif;
        }

        .cf-input, .cf-textarea {
          width: 100%;
          background: #fafaf8;
          border: 1.5px solid #e8e6e0;
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: #1a1a1a;
          outline: none;
          transition: all 0.25s ease;
          box-sizing: border-box;
        }

        .cf-input {
          height: 52px;
          padding: 0 18px;
        }

        .cf-textarea {
          padding: 16px 18px;
          resize: vertical;
          min-height: 140px;
          line-height: 1.7;
        }

        .cf-input::placeholder, .cf-textarea::placeholder {
          color: #b0aca4;
        }

        .cf-input:focus, .cf-textarea:focus {
          border-color: #d4a843;
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(212,168,67,0.12);
        }

        .cf-input:hover, .cf-textarea:hover {
          border-color: #c9943a;
        }

        .cf-label {
          display: block;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: #a0a0a0;
          margin-bottom: 8px;
        }

        .cf-submit {
          width: 100%;
          padding: 17px 24px;
          background: linear-gradient(135deg, #f0c96a 0%, #d4a843 100%);
          border: none;
          border-radius: 12px;
          color: #0d1b2a;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 1.8px;
          text-transform: uppercase;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.3s ease;
          box-shadow: 0 8px 28px rgba(212,168,67,0.38);
        }

        .cf-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 14px 40px rgba(212,168,67,0.52);
        }

        .cf-submit:active:not(:disabled) {
          transform: translateY(0);
        }

        .cf-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          box-shadow: none;
        }

        .cf-success {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(52,199,89,0.1);
          border: 1px solid rgba(52,199,89,0.3);
          border-radius: 12px;
          padding: 14px 20px;
          font-size: 14px;
          font-weight: 500;
          color: #1a7a3a;
          margin-top: 16px;
          animation: fadeIn 0.4s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .cf-spinner {
          animation: spin 0.8s linear infinite;
        }
      `}</style>

      <div className="cf-wrap">
        {/* ── Header ── */}
        <div style={{ marginBottom: "40px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "14px",
            }}
          >
            <span
              style={{
                width: "32px",
                height: "2px",
                background: "linear-gradient(90deg, #d4a843, #f0c96a)",
                borderRadius: "2px",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: "10px",
                fontWeight: "600",
                letterSpacing: "3px",
                textTransform: "uppercase",
                color: "#d4a843",
              }}
            >
              Contact Us
            </span>
          </div>

          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2rem, 4vw, 2.8rem)",
              fontWeight: "700",
              color: "#0d1b2a",
              lineHeight: 1.2,
              letterSpacing: "-0.5px",
              margin: 0,
            }}
          >
            Questions?
            <br />
            <em
              style={{
                fontStyle: "italic",
                fontWeight: "600",
                color: "#1e3a5f",
              }}
            >
              Feel free to contact us.
            </em>
          </h2>
        </div>

        {/* ── Form card ── */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: "24px",
            border: "1px solid #e8e6e0",
            boxShadow: "0 8px 40px rgba(13,27,42,0.08)",
            padding: "40px",
          }}
        >
          <form id="contact-form" onSubmit={sendEmail}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
              }}
            >
              {/* Name */}
              <div>
                <label className="cf-label">Full Name</label>
                <input
                  className="cf-input"
                  type="text"
                  name="user_name"
                  required
                  placeholder="Nguyễn Văn A"
                />
              </div>

              {/* Email */}
              <div>
                <label className="cf-label">Email Address</label>
                <input
                  className="cf-input"
                  type="email"
                  name="user_email"
                  required
                  placeholder="example@email.com"
                />
              </div>

              {/* Subject */}
              <div>
                <label className="cf-label">Subject</label>
                <input
                  className="cf-input"
                  type="text"
                  name="user_subject"
                  required
                  placeholder="How can we help?"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="cf-label">Phone Number</label>
                <input
                  className="cf-input"
                  type="text"
                  name="user_phone"
                  required
                  placeholder="0901 234 567"
                />
              </div>

              {/* Message — full width */}
              <div style={{ gridColumn: "1 / -1" }}>
                <label className="cf-label">Message</label>
                <textarea
                  className="cf-textarea"
                  name="user_message"
                  required
                  placeholder="Write your message here..."
                />
              </div>

              {/* Divider */}
              <div
                style={{
                  gridColumn: "1 / -1",
                  height: "1px",
                  background:
                    "linear-gradient(90deg, #d4a843, #e8e6e0 60%, transparent)",
                }}
              />

              {/* Submit — full width */}
              <div style={{ gridColumn: "1 / -1" }}>
                <button className="cf-submit" type="submit" disabled={sending}>
                  {sending ? (
                    <>
                      <svg
                        className="cf-spinner"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      >
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="22" y1="2" x2="11" y2="13" />
                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                      </svg>
                    </>
                  )}
                </button>

                {/* Success message */}
                {sent && (
                  <div className="cf-success">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    Message sent successfully! We'll get back to you soon.
                  </div>
                )}

                <p
                  style={{
                    textAlign: "center",
                    fontSize: "12px",
                    color: "#a0a0a0",
                    marginTop: "14px",
                    marginBottom: 0,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  🔒 Your information is kept strictly confidential
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ContactForm;
