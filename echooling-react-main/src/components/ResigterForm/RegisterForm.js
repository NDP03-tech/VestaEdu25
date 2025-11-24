import React, { useState } from 'react';

const RegisterForm = ({ courseTitle, courseId, onClose, open }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/course-registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          courseId,
          courseTitle
        })
      });

      if (res.ok) {
        setSubmitted(true);
        setTimeout(() => {
          onClose();
          setFormData({ name: '', email: '', phone: '' });
          setSubmitted(false);
        }, 1500);
      } else {
        const err = await res.json();
        alert(err.message || 'Registration failed.');
      }
    } catch (err) {
      alert('Network or server error.');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="modal show d-block" style={{ backgroundColor: '#00000088' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 rounded shadow">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">Register for: {courseTitle}</h5>
            <button onClick={onClose} className="btn-close btn-close-white"></button>
          </div>
          <div className="modal-body">
            {submitted ? (
              <p className="text-success text-center fw-bold fs-5">✅ Registration Successful!</p>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Full Name</label>
                  <input type="text" className="form-control" name="name" onChange={handleChange} value={formData.name} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-control" name="email" onChange={handleChange} value={formData.email} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Phone Number</label>
                  <input type="text" className="form-control" name="phone" onChange={handleChange} value={formData.phone} required />
                </div>
                <button type="submit" className="btn btn-success w-100 py-2 fw-bold" disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit Registration'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
