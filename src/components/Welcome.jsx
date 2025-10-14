import React, { useEffect, useState } from "react";
import "./Welcome.css";

const images = [
  "/images/Crag-Global-Logo.jpg",
  // Add more background images as needed
];

const Welcome = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="welcome-section">
      {/* Background layer */}
      <div className="background" aria-hidden="true">
        {images.map((img, index) => (
          <div
            key={index}
            className={`bg-image ${index === currentIndex ? "active" : ""}`}
            style={{ backgroundImage: `url(${img})` }}
          ></div>
        ))}
        <div className="gradient-overlay"></div>
      </div>

      {/* Foreground content */}
      <div className="welcome-content">
        <img
          src="/images/Crag-Global-Logo.jpg"
          alt="Crag Global Ltd"
          className="main-logo"
          loading="eager"
        />
        <h1 className="hero-title">CRAG GLOBAL LTD</h1>
        <p className="hero-tagline">WHERE DATA MEETS STRATEGY</p>
      </div>
    </section>
  );
};

export default Welcome;
