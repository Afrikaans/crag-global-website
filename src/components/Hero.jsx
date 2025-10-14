import React from 'react'
import './Hero.css'

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-overlay">
        <div className="hero-content">
          <h1 className="hero-title">Crag Global Ltd</h1>
          <p className="hero-subtitle">
            Strategic Business Consulting & Research Excellence
          </p>
          <div className="hero-description">
            <p>
              Empowering businesses across Africa with data-driven insights, 
              strategic guidance, and innovative solutions for sustainable growth.
            </p>
          </div>
          <div className="hero-cta">
            <button className="btn btn-primary">Get Started</button>
            <button className="btn btn-secondary">Learn More</button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
