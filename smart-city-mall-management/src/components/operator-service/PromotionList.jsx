import { useEffect, useState } from "react";
import axios from "axios";

function PromotionList() {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPromotions = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/promotions");
      setPromotions(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching promotions:", error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this promotion?")) {
      try {
        await axios.delete(`http://localhost:5001/api/promotions/${id}`);
        alert("Promotion deleted successfully!");
        fetchPromotions(); // Refresh the list
      } catch (error) {
        alert("Error deleting promotion");
        console.error(error);
      }
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const isActive = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    return now >= start && now <= end;
  };

  if (loading) {
    return (
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Active Promotions</h2>
        </div>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>
          Loading promotions...
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">
          <div className="card-icon" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
              <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
            </svg>
          </div>
          Active Promotions
        </h2>
      </div>

      {promotions.length === 0 ? (
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>
          No promotions created yet
        </p>
      ) : (
        <div>
          {promotions.map((promo, index) => (
            <div 
              key={promo._id} 
              className="promotion-item"
              style={{ 
                animationDelay: `${index * 0.1}s`,
                padding: '1.25rem',
                background: 'var(--primary)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                marginBottom: '1rem',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                      {promo.title}
                    </h3>
                    {isActive(promo.startDate, promo.endDate) ? (
                      <span className="badge badge-success">Active</span>
                    ) : (
                      <span className="badge" style={{ background: 'rgba(156, 163, 175, 0.15)', color: 'var(--text-secondary)' }}>
                        Inactive
                      </span>
                    )}
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                    <strong style={{ color: 'var(--text-primary)' }}>{promo.storeName}</strong>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(promo._id)}
                  style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: 'var(--danger)',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                  }}
                >
                  Delete
                </button>
              </div>

              <div style={{ 
                display: 'flex', 
                gap: '1.5rem', 
                color: 'var(--text-secondary)', 
                fontSize: '0.9rem',
                flexWrap: 'wrap' 
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span style={{ color: 'var(--success)', fontWeight: 600 }}>{promo.discount}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  {formatDate(promo.startDate)} - {formatDate(promo.endDate)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PromotionList;
