import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/api';
import { Tag, Calendar, Clock, MapPin, Users, Ticket } from 'lucide-react';
import toast from 'react-hot-toast';

export function UserDeals() {
  const { user } = useAuth();
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = user?._id || user?.id;

  useEffect(() => {
    if (!userId) return;
    userService.browseDeals(userId)
      .then(res => setDeals(res.data.data || []))
      .catch(() => toast.error('Failed to load deals'))
      .finally(() => setLoading(false));
  }, [userId]);

  const discountColors = { percentage: 'var(--success)', fixed: 'var(--info)', buy_x_get_y: 'var(--warning)', bundle: 'var(--accent)' };

  return (
    <div className="animate-in">
      <div className="page-title">Active Deals</div>
      <div className="page-subtitle">Exclusive discounts and offers at Smart City Mall</div>

      {loading ? (
        <div className="loading"><div className="spinner" /></div>
      ) : deals.length === 0 ? (
        <div className="empty-state"><Tag size={48} /><p>No active deals right now</p></div>
      ) : (
        <div className="grid grid-3">
          {deals.map(deal => (
            <div key={deal._id} className="card" style={{
              position: 'relative', overflow: 'hidden',
              borderLeft: `3px solid ${discountColors[deal.discount_type] || 'var(--accent)'}`,
              transition: 'transform 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
              {/* Big discount badge */}
              <div style={{
                position: 'absolute', top: '-10px', right: '-10px',
                width: '70px', height: '70px', borderRadius: '50%',
                background: `${discountColors[deal.discount_type]}20`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{ fontSize: '18px', fontWeight: 700, color: discountColors[deal.discount_type], fontFamily: 'var(--font-display)', textAlign: 'center', lineHeight: 1.1 }}>
                  {deal.discount_type === 'percentage' ? `${deal.discount_value}%` : `Rs.${deal.discount_value}`}
                </div>
              </div>
              <div style={{ paddingRight: '60px' }}>
                <span className="badge" style={{ background: `${discountColors[deal.discount_type]}20`, color: discountColors[deal.discount_type], marginBottom: '10px', fontSize: '11px' }}>
                  {deal.discount_type?.replace('_', ' ')}
                </span>
                <div style={{ fontWeight: 600, fontSize: '15px', marginBottom: '6px' }}>{deal.title}</div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: 1.5 }}>{deal.description}</div>
              </div>
              {deal.original_price && (
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  Original: <span style={{ textDecoration: 'line-through' }}>Rs.{deal.original_price.toLocaleString()}</span>
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>
                <Clock size={12} />
                Valid until {new Date(deal.valid_until).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function UserEvents() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = user?._id || user?.id;

  useEffect(() => {
    if (!userId) return;
    userService.browseEvents(userId)
      .then(res => setEvents(res.data.data || []))
      .catch(() => toast.error('Failed to load events'))
      .finally(() => setLoading(false));
  }, [userId]);

  const eventTypeColors = {
    sale: 'var(--success)', entertainment: 'var(--info)', exhibition: 'var(--accent)',
    food_festival: 'var(--warning)', kids_event: 'var(--danger)', seasonal: 'var(--accent)',
  };

  const EVENT_IMAGES = [
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&q=60',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=60',
    'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=400&q=60',
  ];

  return (
    <div className="animate-in">
      <div className="page-title">Upcoming Events</div>
      <div className="page-subtitle">Don't miss out on what's happening at Smart City Mall</div>

      {loading ? (
        <div className="loading"><div className="spinner" /></div>
      ) : events.length === 0 ? (
        <div className="empty-state"><Calendar size={48} /><p>No upcoming events</p></div>
      ) : (
        <div className="grid grid-2">
          {events.map((ev, idx) => (
            <div key={ev._id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{
                height: '160px',
                backgroundImage: `url('${EVENT_IMAGES[idx % EVENT_IMAGES.length]}')`,
                backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative',
              }}>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.7))' }} />
                <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
                  <span className="badge" style={{
                    background: `${eventTypeColors[ev.event_type] || 'var(--accent)'}30`,
                    color: eventTypeColors[ev.event_type] || 'var(--accent)',
                    border: `1px solid ${eventTypeColors[ev.event_type] || 'var(--accent)'}50`,
                    fontSize: '11px'
                  }}>
                    {ev.event_type?.replace('_', ' ')}
                  </span>
                </div>
                {ev.is_free && (
                  <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                    <span className="badge badge-success" style={{ fontSize: '11px' }}>Free Entry</span>
                  </div>
                )}
              </div>
              <div style={{ padding: '16px' }}>
                <div style={{ fontWeight: 600, fontSize: '16px', marginBottom: '6px' }}>{ev.name}</div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {ev.description}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '12px', color: 'var(--text-muted)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={12} />{ev.location_in_mall}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} />
                    {new Date(ev.start_time).toLocaleDateString()} · {new Date(ev.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {ev.max_capacity && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Users size={12} /> {ev.current_attendance || 0}/{ev.max_capacity}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
