import React from 'react';
import './Products.css';

export default function Products() {
  return (
    <section className="products-section">
      <div className="products-container">
        <h2 className="products-title">Our Products & Solutions</h2>
        <p className="products-tagline">
          We deliver smart automation, powerful analytics, reliable infrastructure, and hands-on training.
        </p>

        <div className="products-grid">

          {/* Salesforce Automation */}
          <div className="product-card salesforce">
            <div className="card-header">
              <h3>Salesforce Automation</h3>
            </div>
            <div className="card-logo">
              <img src="/images/salesforce-icon.svg" alt="Salesforce" />
            </div>
          </div>

          {/* Analytics */}
          <div className="product-card analytics">
            <div className="card-header">
              <h3>Analytics</h3>
              <p className="card-sub">Explore insights with our analytics stack.</p>
            </div>

            <div className="subtools">
              <div className="subtool">
                <img src="/images/power-bi-icon.svg" alt="Power BI" />
                <span>Power BI</span>
              </div>
              <div className="subtool">
                <img src="/images/qgis-icon.svg" alt="QGIS" />
                <span>QGIS</span>
              </div>
              <div className="subtool">
                <img src="/images/r-icon.svg" alt="R" />
                <span>R</span>
              </div>
              <div className="subtool">
                <img src="/images/python-icon.svg" alt="Python" />
                <span>Python</span>
              </div>
              <div className="subtool">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="seo-icon"
                >
                  <path d="M10 2a8 8 0 105.293 14.293l4.707 4.707 1.414-1.414-4.707-4.707A8 8 0 0010 2zm0 2a6 6 0 110 12A6 6 0 0110 4z" />
                </svg>
                <span>SEO</span>
              </div>
            </div>
          </div>

          {/* Database Infrastructure */}
          <div className="product-card database">
            <div className="card-header">
              <h3>Database Infrastructure</h3>
            </div>
            <div className="card-logo">
              <img src="/images/database-icon.svg" alt="Database" />
            </div>
          </div>

          {/* Training */}
          <div className="training-container">
            <div className="product-card training">
              <div className="card-header">
                <h3>Training</h3>
              </div>
              <div className="card-logo">
                <img src="/images/training-icon.svg" alt="Training" />
              </div>
            </div>
            
            <div className="training-description">
              <p className="card-sub">
                We offer hands-on sessions in Power BI, QGIS, R, Python & Search Engine Optimization.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
