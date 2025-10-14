import React from 'react'
import './Services.css'

export default function Services() {
  const services = [
    {
      title: 'Strategic Consulting',
      description: 'Expert guidance for business growth'
    },
    {
      title: 'Global Solutions',
      description: 'International business development'
    },
    {
      title: 'Digital Transformation',
      description: 'Modern solutions for the digital age'
    }
  ]

  return (
    <section className="services" role="region" aria-label="services">
      <div className="container">
        <h2>Our Services</h2>
        <div className="service-grid">
          {services.map((service, index) => (
            <div key={index} className="service-card">
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}