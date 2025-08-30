import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>FilterFlow Pro</h3>
            <p>Create, manage, and apply powerful filters to your data with ease.</p>
          </div>

          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul className="footer-links">
              <li><a href="/">Home</a></li>
              <li><a href="/dashboard">Dashboard</a></li>
              <li><a href="/filter-builder">Create Filter</a></li>
              <li><a href="/my-filters">My Filters</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Resources</h3>
            <ul className="footer-links">
              <li><a href="#">Documentation</a></li>
              <li><a href="#">Tutorials</a></li>
              <li><a href="#">API Reference</a></li>
              <li><a href="#">Support</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Connect</h3>
            <div className="social-links">
              <a href="#" aria-label="Twitter">
                <span className="social-icon">🐦</span>
              </a>
              <a href="#" aria-label="GitHub">
                <span className="social-icon">🐙</span>
              </a>
              <a href="#" aria-label="LinkedIn">
                <span className="social-icon">👔</span>
              </a>
              <a href="#" aria-label="Discord">
                <span className="social-icon">💬</span>
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} FilterFlow Pro. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
