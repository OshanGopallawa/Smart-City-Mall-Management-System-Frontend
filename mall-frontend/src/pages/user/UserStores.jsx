import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/api';
import { Store, Search, Filter, MapPin, Clock, Phone, Star } from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = ['All', 'Fashion', 'Electronics', 'Food & Beverage', 'Entertainment', 'Health & Beauty', 'Sports', 'Books', 'Toys', 'Other'];
const STORE_IMAGES = {
  'Fashion': 'https://images.unsplash.com/photo-1558171813-1b5e5e7a0d28?w=400&q=60',
  'Electronics': 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=400&q=60',
  'Food & Beverage': 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=60',
  'Sports': 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=60',
  'default': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&q=60',
};

export default function UserStores() {
  const { user } = useAuth();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [visitingId, setVisitingId] = useState(null);

  const userId = user?._id || user?.id;

  const fetchStores = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (category !== 'All') params.category = category;
      const res = await userService.browseStores(userId, params);
      setStores(res.data.data || []);
    } catch { toast.error('Failed to load stores'); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (userId) fetchStores(); }, [userId, category]);

  const handleSearch = (e) => { e.preventDefault(); fetchStores(); };

  const handleVisit = async (store) => {
    setVisitingId(store._id);
    try {
      await userService.visitStore(userId, { store_id: store._id, store_name: store.name });
      toast.success(`Visited ${store.name}!`);
    } catch { toast.error('Failed to record visit'); }
    finally { setVisitingId(null); }
  };

  return (
    <div className="animate-in">
      <div className="page-title">Browse Stores</div>
      <div className="page-subtitle">Discover all stores at Smart City Mall</div>

      {/* Search + filter */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px', flex: 1, minWidth: '200px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input placeholder="Search stores..." value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: '38px' }} />
          </div>
          <button type="submit" className="btn btn-primary">Search</button>
        </form>
      </div>

      {/* Category pills */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setCategory(cat)}
            style={{
              padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 500,
              background: category === cat ? 'var(--accent)' : 'var(--bg-card)',
              color: category === cat ? '#0a0a0f' : 'var(--text-secondary)',
              border: `1px solid ${category === cat ? 'var(--accent)' : 'var(--border)'}`,
              cursor: 'pointer', transition: 'all 0.15s',
            }}>
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading"><div className="spinner" /></div>
      ) : stores.length === 0 ? (
        <div className="empty-state"><Store size={48} /><p>No stores found</p></div>
      ) : (
        <div className="grid grid-3">
          {stores.map(store => (
            <div key={store._id} className="card" style={{ padding: 0, overflow: 'hidden', transition: 'transform 0.2s, border-color 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'var(--accent-border)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--border)'; }}>
              {/* Store image */}
              <div style={{
                height: '140px',
                backgroundImage: `url('${STORE_IMAGES[store.category] || STORE_IMAGES.default}')`,
                backgroundSize: 'cover', backgroundPosition: 'center',
                position: 'relative',
              }}>
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)' }} />
                <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                  <span className="badge badge-gold">{store.category}</span>
                </div>
              </div>
              <div style={{ padding: '16px' }}>
                <div style={{ fontWeight: 600, fontSize: '16px', marginBottom: '6px' }}>{store.name}</div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '10px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {store.description || 'Visit us for the best products and services.'}
                </div>
                <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={12} /> Floor {store.floor}, {store.unit_number}</span>
                  {store.contact_phone && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Phone size={12} /> {store.contact_phone}</span>}
                </div>
                <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', fontSize: '13px' }}
                  onClick={() => handleVisit(store)} disabled={visitingId === store._id}>
                  {visitingId === store._id ? <span className="spinner" style={{ width: '14px', height: '14px' }} /> : 'Mark as Visited'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
