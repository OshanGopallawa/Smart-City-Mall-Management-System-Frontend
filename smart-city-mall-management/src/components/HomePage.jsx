import { useState, useEffect } from "react";
import axios from "axios";
import "../HomePage.css";

function HomePage() {
  const [stats, setStats] = useState({
    totalStores: 0,
    totalPromotions: 0,
    totalEvents: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [storesRes, promotionsRes, eventsRes] = await Promise.all([
        axios.get("http://localhost:5001/api/stores"),
        axios.get("http://localhost:5001/api/promotions"),
        axios.get("http://localhost:5001/api/events"),
      ]);

      setStats({
        totalStores: storesRes.data.length,
        totalPromotions: promotionsRes.data.length,
        totalEvents: eventsRes.data.length,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  return (
    <div className="homepage">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Welcome to <span className="gradient-text">MallHub</span>
          </h1>
          <p className="hero-subtitle">
            Your centralized platform for managing stores, promotions, and events
          </p>
        </div>
        
        <div className="hero-stats">
          <div className="stat-card">
            <div className="stat-icon stores">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.totalStores}</div>
              <div className="stat-label">Active Stores</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon promotions">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.totalPromotions}</div>
              <div className="stat-label">Active Promotions</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon events">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.totalEvents}</div>
              <div className="stat-label">Upcoming Events</div>
            </div>
          </div>
        </div>
      </div>

      <div className="features-section">
        <h2 className="section-title">Quick Actions</h2>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon stores">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="feature-title">Store Management</h3>
            <p className="feature-description">
              Add, edit, and organize stores across different floors and categories
            </p>
            <div className="feature-action">Manage Stores →</div>
          </div>

          <div className="feature-card">
            <div className="feature-icon promotions">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h3 className="feature-title">Promotions</h3>
            <p className="feature-description">
              Create and track promotional campaigns to boost store engagement
            </p>
            <div className="feature-action">Create Promotion →</div>
          </div>

          <div className="feature-card">
            <div className="feature-icon events">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <h3 className="feature-title">Events</h3>
            <p className="feature-description">
              Schedule and manage mall-wide events to attract visitors
            </p>
            <div className="feature-action">Plan Event →</div>
          </div>
        </div>
      </div>

      <div className="activity-section">
        <div className="activity-header">
          <h2 className="section-title">Recent Activity</h2>
          <button className="view-all-btn">View All</button>
        </div>
        
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon stores">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </div>
            <div className="activity-content">
              <div className="activity-title">New store added</div>
              <div className="activity-time">2 hours ago</div>
            </div>
          </div>

          <div className="activity-item">
            <div className="activity-icon promotions">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 11 12 14 22 4" />
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
              </svg>
            </div>
            <div className="activity-content">
              <div className="activity-title">Promotion activated</div>
              <div className="activity-time">5 hours ago</div>
            </div>
          </div>

          <div className="activity-item">
            <div className="activity-icon events">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div className="activity-content">
              <div className="activity-title">Event scheduled</div>
              <div className="activity-time">1 day ago</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
