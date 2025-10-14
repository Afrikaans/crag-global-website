import React from 'react';
import './Mission.css';

const Mission = () => (
  <section className="mission parallax">
    <div className="mission-overlay" />

    <div className="mission-content">
      <h2 className="mission-title">Our Mission</h2>
      <p className="mission-intro">
        To be a leading business consultancy and research partner of choice,
        helping organisations thrive in today’s dynamic environment.
      </p>

      <blockquote className="mission-statement">
        To be Africa's leading hub for data-driven marketing, research and
        capacity building—setting the standard for excellence and sustainable
        growth across the continent.
      </blockquote>

      <p className="mission-description">
        Let us help you navigate your business journey with innovative consulting
        and transformative capacity building.
      </p>

      <button className="mission-cta-button">Explore Crag Ltd</button>
    </div>
  </section>
);

export default Mission;