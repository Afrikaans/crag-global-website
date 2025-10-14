import React, { useState } from 'react';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = (data) => {
    const errors = {};
    if (!data.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      errors.email = 'Invalid email address';
    }
    if (data.message.length < 10) {
      errors.message = 'Message too short';
    }
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm(formData);
    if (Object.keys(errors).length === 0) {
      console.log('Form submitted:', formData);
      alert('Thank you for reaching out to Crag Global Ltd! We will contact you soon.');
    } else {
      setErrors(errors);
    }
  };

  return (
    <section className="contact-section" id="contact">
      <div className="contact-container">
        <div className="contact-header">
          <h1>Get in Touch</h1>
          <p>Let's discuss how we can help your business grow</p>
        </div>

        <div className="contact-content">
          <div className="contact-info">
            <h2>Crag Global Ltd</h2>
            <div className="info-items">
              <div className="info-item">
                <i className="fas fa-map-marker-alt"></i>
                <div>
                  <p>3rd Floor, Riverside Towers</p>
                  <p>Chiromo Road, Westlands</p>
                  <p>Nairobi, Kenya</p>
                </div>
              </div>
              
              <div className="info-item">
                <i className="fas fa-phone"></i>
                <p>+254 720 664 599</p>
              </div>
              
              <div className="info-item">
                <i className="fas fa-envelope"></i>
                <p>info@cragglobal.tech</p>
              </div>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                {errors.email && <p className="error-message">{errors.email}</p>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="company"
                  placeholder="Company Name"
                  value={formData.company}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <textarea
                name="message"
                placeholder="Your Message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
              {errors.message && <p className="error-message">{errors.message}</p>}
            </div>

            <button type="submit" className="submit-btn">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;