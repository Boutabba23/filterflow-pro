import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useFilter } from '../contexts/FilterContext';
import LoadingSpinner from '../components/common/Alert';
import './Dashboard.css';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const { filters, loading, fetchFilters } = useFilter();
  const [recentFilters, setRecentFilters] = useState([]);

  useEffect(() => {
    fetchFilters();
  }, [fetchFilters]);

  useEffect(() => {
    if (filters.length > 0) {
      // Get the 3 most recent filters
      setRecentFilters(filters.slice(0, 3));
    }
  }, [filters]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>Welcome back, {currentUser?.displayName || 'User'}!</h1>
          <p>Here's an overview of your FilterFlow Pro account</p>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <h3>{filters.length}</h3>
              <p>Total Filters</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🔄</div>
            <div className="stat-content">
              <h3>{filters.filter(f => f.lastUsed).length}</h3>
              <p>Active Filters</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📈</div>
            <div className="stat-content">
              <h3>{Math.floor(Math.random() * 1000)}</h3>
              <p>Data Processed</p>
            </div>
          </div>
        </div>

        <div className="dashboard-actions">
          <Link to="/filter-builder" className="btn btn-primary">
            Create New Filter
          </Link>
          <Link to="/my-filters" className="btn btn-outline">
            View All Filters
          </Link>
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <h2>Recent Filters</h2>
            <Link to="/my-filters" className="view-all">View All</Link>
          </div>

          {recentFilters.length > 0 ? (
            <div className="recent-filters">
              {recentFilters.map((filter) => (
                <div key={filter.id} className="filter-card">
                  <div className="filter-header">
                    <h3>{filter.name}</h3>
                    <span className={`filter-status ${filter.status || 'active'}`}>
                      {filter.status || 'Active'}
                    </span>
                  </div>
                  <p className="filter-description">
                    {filter.description || 'No description provided'}
                  </p>
                  <div className="filter-meta">
                    <span className="filter-date">
                      Created: {new Date(filter.createdAt).toLocaleDateString()}
                    </span>
                    <Link to={`/filter-builder?id=${filter.id}`} className="btn btn-sm">
                      Edit
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>No filters yet</h3>
              <p>Create your first filter to get started</p>
              <Link to="/filter-builder" className="btn btn-primary">
                Create Filter
              </Link>
            </div>
          )}
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <h2>Quick Tips</h2>
          </div>
          <div className="tips-container">
            <div className="tip-card">
              <div className="tip-icon">💡</div>
              <h3>Save Time with Templates</h3>
              <p>Use our pre-built filter templates to quickly create common filters.</p>
            </div>
            <div className="tip-card">
              <div className="tip-icon">🔄</div>
              <h3>Reuse Your Filters</h3>
              <p>Apply saved filters to new datasets with a single click.</p>
            </div>
            <div className="tip-card">
              <div className="tip-icon">📊</div>
              <h3>Visualize Results</h3>
              <p>Turn your filtered data into charts and graphs for better insights.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
