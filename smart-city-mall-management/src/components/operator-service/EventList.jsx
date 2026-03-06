import { useEffect, useState } from "react";
import axios from "axios";

function EventList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/events");
      setEvents(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching events:", error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await axios.delete(`http://localhost:5001/api/events/${id}`);
        alert("Event deleted successfully!");
        fetchEvents(); // Refresh the list
      } catch (error) {
        alert("Error deleting event");
        console.error(error);
      }
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Upcoming Events</h2>
        </div>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>
          Loading events...
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">
          <div className="card-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          Upcoming Events
        </h2>
      </div>

      {events.length === 0 ? (
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>
          No events scheduled yet
        </p>
      ) : (
        <div>
          {events.map((event, index) => (
            <div 
              key={event._id} 
              className="event-item"
              style={{ 
                animationDelay: `${index * 0.1}s`,
                padding: '1.5rem',
                background: 'var(--primary)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                marginBottom: '1rem',
                transition: 'all 0.2s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = 'var(--warning)';
                e.currentTarget.style.transform = 'translateX(4px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              <div style={{ 
                position: 'absolute',
                top: 0,
                left: 0,
                width: '4px',
                height: '100%',
                background: 'linear-gradient(180deg, #f59e0b, #d97706)'
              }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                <div style={{ flex: 1, paddingLeft: '0.5rem' }}>
                  <h3 style={{ 
                    fontSize: '1.25rem', 
                    fontWeight: 600, 
                    color: 'var(--text-primary)', 
                    margin: '0 0 0.5rem 0' 
                  }}>
                    {event.name}
                  </h3>
                  
                  {event.eventDate && (
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.5rem',
                      color: 'var(--warning)',
                      fontSize: '0.9rem',
                      fontWeight: 500,
                      marginBottom: '0.75rem'
                    }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      {formatDate(event.eventDate)}
                    </div>
                  )}
                </div>
                
                <button
                  onClick={() => handleDelete(event._id)}
                  style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: 'var(--danger)',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                  }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                  </svg>
                  Delete
                </button>
              </div>

              <p style={{ 
                color: 'var(--text-secondary)', 
                lineHeight: 1.6,
                marginBottom: '1rem',
                paddingLeft: '0.5rem'
              }}>
                {event.description}
              </p>

              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                color: 'var(--text-secondary)',
                fontSize: '0.9rem',
                paddingLeft: '0.5rem'
              }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                  {event.location}
                </span>
              </div>

              {event.createdAt && (
                <div style={{
                  marginTop: '1rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid var(--border)',
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary)',
                  paddingLeft: '0.5rem'
                }}>
                  Created {new Date(event.createdAt).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EventList;
