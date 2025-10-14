import React from 'react'
import './Header.css'

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <a href="/" className="logo-link">
            Crag Global Ltd
            <span className="logo-dot"></span>
          </a>
        </div>
        <nav className="nav">
          <a href="/" className="nav-link">
            Home
            <span className="nav-indicator"></span>
          </a>
          <a href="#about" className="nav-link">
            About
            <span className="nav-indicator"></span>
          </a>
          <a href="#services" className="nav-link">
            Services
            <span className="nav-indicator"></span>
          </a>
          <a href="#contact" className="nav-link">
            Contact
            <span className="nav-indicator"></span>
          </a>
        </nav>
      </div>
    </header>
  )
}

export default Header
