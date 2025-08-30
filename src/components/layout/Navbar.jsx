import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Navbar.css';

const Navbar = ({ darkMode, toggleDarkMode }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <div className="navbar-logo">
          <Link to="/">
            <span className="logo-icon">🔍</span>
            <span className="logo-text">FilterFlow Pro</span>
          </Link>
        </div>

        <div className={`navbar-menu ${mobileMenuOpen ? 'active' : ''}`}>
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link to="/" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                Home
              </Link>
            </li>

            {currentUser ? (
              <>
                <li className="nav-item">
                  <Link to="/dashboard" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/filter-builder" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                    Create Filter
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/my-filters" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                    My Filters
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/profile" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                    Profile
                  </Link>
                </li>
                <li className="nav-item">
                  <button onClick={handleLogout} className="nav-link logout-btn">
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link to="/login" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/register" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                    Register
                  </Link>
                </li>
              </>
            )}

            <li className="nav-item theme-toggle">
              <button 
                onClick={toggleDarkMode} 
                className="theme-toggle-btn"
                aria-label="Toggle dark mode"
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
            </li>
          </ul>
        </div>

        <button 
          className="mobile-menu-btn" 
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
