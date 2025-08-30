import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <div className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">FilterFlow Pro</h1>
            <p className="hero-subtitle">Create, manage, and apply powerful filters to your data with ease</p>
            <div className="hero-buttons">
              <Link to="/register" className="btn btn-primary">Get Started</Link>
              <Link to="/login" className="btn btn-outline">Sign In</Link>
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-graphic">
              <div className="filter-icon">🔍</div>
              <div className="data-flow">
                <div className="data-item"></div>
                <div className="data-item"></div>
                <div className="data-item"></div>
                <div className="filter-box">
                  <div className="filtered-item"></div>
                  <div className="filtered-item"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="features">
        <div className="container">
          <h2 className="section-title">Powerful Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🛠️</div>
              <h3>Easy Filter Builder</h3>
              <p>Create complex filters with our intuitive drag-and-drop interface. No coding required.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💾</div>
              <h3>Save & Reuse</h3>
              <p>Save your filters for future use and apply them to new datasets with a single click.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔄</div>
              <h3>Real-time Preview</h3>
              <p>See results instantly as you build your filters. Make adjustments on the fly.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Data Insights</h3>
              <p>Gain valuable insights from your filtered data with our visualization tools.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to streamline your data filtering?</h2>
            <p>Join thousands of users who trust FilterFlow Pro for their data processing needs.</p>
            <Link to="/register" className="btn btn-primary btn-large">Create Free Account</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
