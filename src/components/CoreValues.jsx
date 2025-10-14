import React from 'react';
import './CoreValues.css';

const CoreValues = () => {
  const values = [
    { icon: 'fas fa-lightbulb', title: 'Innovation' },
    { icon: 'fas fa-check-circle', title: 'Integrity' },
    { icon: 'fas fa-globe', title: 'Impact' },
    { icon: 'fas fa-users', title: 'Capacity Building' },
    { icon: 'fas fa-handshake', title: 'Collaboration' },
  ];

  return (
    <section className="core-values">
      <div className="core-values-container">
        <h2 className="core-values-title">Core Values</h2>
        <p className="core-values-description">
          Our core values guide our actions and decisions.
        </p>
        <div className="cards">
          {values.map((value, index) => (
            <div className="card" key={index}>
              <div className="img">
                <i className={value.icon}></i>
              </div>
              <div className="textBox">
                <p className="tip">{value.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoreValues;