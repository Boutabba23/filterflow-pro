import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { FilterProvider } from './contexts/FilterContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import FilterBuilder from './pages/FilterBuilder';
import FilterList from './pages/FilterList';
import Profile from './pages/Profile';
import PrivateRoute from './components/auth/PrivateRoute';
import './App.css';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
  }, []);

  useEffect(() => {
    // Apply dark mode class to body
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    // Save theme preference
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <AuthProvider>
      <FilterProvider>
        <div className={`app ${darkMode ? 'dark' : ''}`}>
          <Router>
            <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route 
                  path="/dashboard" 
                  element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/filter-builder" 
                  element={
                    <PrivateRoute>
                      <FilterBuilder />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/my-filters" 
                  element={
                    <PrivateRoute>
                      <FilterList />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/profile" 
                  element={
                    <PrivateRoute>
                      <Profile />
                    </PrivateRoute>
                  } 
                />
              </Routes>
            </main>
            <Footer />
          </Router>
        </div>
      </FilterProvider>
    </AuthProvider>
  );
}

export default App;
