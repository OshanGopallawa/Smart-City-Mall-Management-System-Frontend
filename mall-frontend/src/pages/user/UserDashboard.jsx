import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/api';
import { Store, Tag, Calendar, ShoppingBag, Star, ArrowRight, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function UserDashboard() {
  const { user } = useAuth();
  const [stores, setStores] = useState([]);
  const [deals, setDeals] = useState([]);
  const [events, setEvents] = useState([]);
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    const id = user._id || user.id;
    Promise.all([
      userService.browseStores(id, { limit: 6 }),
      userService.browseDeals(id),
      userService.browseEvents(id),
      userService.visitedStores(id),
    ]).then(([s, d, ev, v]) => {
      setStores(s.data.data?.slice(0, 4) || []);
      setDeals(d.data.data?.slice(0, 3) || []);
      setEvents(ev.data.data?.slice(0, 3) || []);
      setVisits(v.data.data?.slice(0, 5) || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [user]);

  const membershipColors = {
    bronze: '#cd7f32', silver: '#c0c0c0', gold: '#c9a84c', platinum: '#e5e4e2'
  };

  if (loading) return <div className="loading"><div className="spinner" /></div>;

  return (
    <div className="animate-in">
      {/* Welcome banner */}
      <div style={{
        background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-hover) 100%)',
        border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)',
        padding: '28px 32px', marginBottom: '24px',
        position: 'relative', overflow: 'hidden',
        backgroundImage: `url('https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=1200&q=60')`,
        backgroundSize: 'cover', backgroundPosition: 'center',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,10,15,0.82)', borderRadius: 'var(--radius-lg)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', marginBottom: '6px' }}>
                Welcome back, {user?.name?.split(' ')[0]}
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                Discover the best stores, deals and events at Smart City Mall
              </p>
            </div>
            <div style={{
              background: 'var(--accent-dim)', border: '1px solid var(--accent-border)',
              borderRadius: 'var(--radius)', padding: '12px 20px', textAlign: 'center',
            }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Membership</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: membershipColors[user?.membership_level] || 'var(--accent)', textTransform: 'capitalize', fontFamily: 'var(--font-display)' }}>
                {user?.membership_level}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                {user?.membership_points || 0} pts
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-4" style={{ marginBottom: '28px' }}>
        {[
          { label: 'Total Stores', value: stores.length, icon: Store, color: 'var(--info)' },
          { label: 'Active Deals', value: deals.length, icon: Tag, color: 'var(--success)' },
          { label: 'Upcoming Events', value: events.length, icon: Calendar, color: 'var(--warning)' },
          { label: 'My Visits', value: visits.length, icon: ShoppingBag, color: 'var(--accent)' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div className="stat-value" style={{ fontSize: '28px' }}>{value}</div>
                <div className="stat-label">{label}</div>
              </div>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={20} color={color} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-2">
        {/* Featured stores */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div className="section-title" style={{ marginBottom: 0 }}><Store size={16} color="var(--accent)" /> Featured Stores</div>
            <button className="btn btn-ghost" style={{ fontSize: '13px', padding: '4px 8px' }} onClick={() => navigate('/user/stores')}>
              View all <ArrowRight size={14} />
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {stores.length === 0 ? (
              <div className="empty-state"><Store size={32} /><p>No stores available yet</p></div>
            ) : stores.map(store => (
              <div key={store._id} className="card" style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }}
                onClick={() => navigate('/user/stores')}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '10px',
                  backgroundImage: `url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100&q=60')`,
                  backgroundSize: 'cover', flexShrink: 0,
                }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 500, fontSize: '14px', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{store.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{store.category} · Floor {store.floor}</div>
                </div>
                <div className="badge badge-gold" style={{ fontSize: '11px', flexShrink: 0 }}>{store.unit_number}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Active deals */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div className="section-title" style={{ marginBottom: 0 }}><Tag size={16} color="var(--success)" /> Active Deals</div>
            <button className="btn btn-ghost" style={{ fontSize: '13px', padding: '4px 8px' }} onClick={() => navigate('/user/deals')}>
              View all <ArrowRight size={14} />
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {deals.length === 0 ? (
              <div className="empty-state"><Tag size={32} /><p>No active deals right now</p></div>
            ) : deals.map(deal => (
              <div key={deal._id} className="card" style={{ padding: '14px 16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                  <div style={{ fontWeight: 500, fontSize: '14px', flex: 1, marginRight: '8px' }}>{deal.title}</div>
                  <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--success)', fontFamily: 'var(--font-display)', flexShrink: 0 }}>
                    {deal.discount_type === 'percentage' ? `${deal.discount_value}%` : `Rs.${deal.discount_value}`}
                  </div>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Valid until {new Date(deal.valid_until).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming events */}
      {events.length > 0 && (
        <div style={{ marginTop: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div className="section-title" style={{ marginBottom: 0 }}><Calendar size={16} color="var(--warning)" /> Upcoming Events</div>
            <button className="btn btn-ghost" style={{ fontSize: '13px', padding: '4px 8px' }} onClick={() => navigate('/user/events')}>
              View all <ArrowRight size={14} />
            </button>
          </div>
          <div className="grid grid-3">
            {events.map(ev => (
              <div key={ev._id} className="card" style={{ position: 'relative', overflow: 'hidden' }}>
                <div style={{
                  height: '80px', marginBottom: '12px', borderRadius: '8px',
                  backgroundImage: `url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&q=60')`,
                  backgroundSize: 'cover', backgroundPosition: 'center',
                  filter: 'brightness(0.6)',
                }} />
                <div className="badge badge-warning" style={{ fontSize: '11px', marginBottom: '8px' }}>{ev.event_type?.replace('_', ' ')}</div>
                <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>{ev.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{ev.location_in_mall}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '6px' }}>
                  {new Date(ev.start_time).toLocaleDateString()}
                  {ev.is_free && <span className="badge badge-success" style={{ marginLeft: '8px', fontSize: '10px' }}>Free</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
