import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userService, operatorService, mallService } from '../../services/api';
import { ShoppingBag, Calendar, Plus, Edit2, Trash2, X, MapPin, Clock, Users } from 'lucide-react';
import toast from 'react-hot-toast';

export function UserVisits() {
  const { user } = useAuth();
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = user?._id || user?.id;

  useEffect(() => {
    if (!userId) return;
    userService.visitedStores(userId)
      .then(res => setVisits(res.data.data || []))
      .catch(() => toast.error('Failed to load visits'))
      .finally(() => setLoading(false));
  }, [userId]);

  return (
    <div className="animate-in">
      <div className="page-title">My Store Visits</div>
      <div className="page-subtitle">Your visit history at Smart City Mall</div>

      {loading ? (
        <div className="loading"><div className="spinner" /></div>
      ) : visits.length === 0 ? (
        <div className="empty-state"><ShoppingBag size={48} /><p>No visits recorded yet. Browse stores and mark them as visited.</p></div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Store Name</th>
                <th>Store ID</th>
                <th>Visited At</th>
              </tr>
            </thead>
            <tbody>
              {visits.map((v, i) => (
                <tr key={v._id}>
                  <td style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{i + 1}</td>
                  <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{v.store_name || 'Unknown Store'}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>{v.store_id?.slice(-12)}</td>
                  <td style={{ fontSize: '13px' }}>{new Date(v.visited_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export function OperatorEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '', description: '', event_type: 'entertainment',
    location_in_mall: '', start_time: '', end_time: '',
    max_capacity: '', is_free: true, ticket_price: ''
  });

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await mallService.getEvents({ upcoming_only: false });
      setEvents(res.data.data || []);
    } catch { toast.error('Failed to load events'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchEvents(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', description: '', event_type: 'entertainment', location_in_mall: '', start_time: '', end_time: '', max_capacity: '', is_free: true, ticket_price: '' });
    setShowModal(true);
  };

  const openEdit = (ev) => {
    setEditing(ev);
    setForm({
      name: ev.name, description: ev.description, event_type: ev.event_type,
      location_in_mall: ev.location_in_mall,
      start_time: ev.start_time?.slice(0, 16) || '',
      end_time: ev.end_time?.slice(0, 16) || '',
      max_capacity: ev.max_capacity || '', is_free: ev.is_free, ticket_price: ev.ticket_price || ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      start_time: new Date(form.start_time).toISOString(),
      end_time: new Date(form.end_time).toISOString(),
      ...(form.max_capacity && { max_capacity: parseInt(form.max_capacity) }),
      ...(!form.is_free && form.ticket_price && { ticket_price: parseFloat(form.ticket_price) }),
    };
    try {
      if (editing) {
        await mallService.updateEvent(editing._id, payload);
        toast.success('Event updated!');
      } else {
        await operatorService.createEvent(payload);
        toast.success('Event created!');
      }
      setShowModal(false);
      fetchEvents();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save event');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Cancel this event?')) return;
    try {
      await mallService.deleteEvent(id);
      toast.success('Event cancelled');
      fetchEvents();
    } catch { toast.error('Failed'); }
  };

  const EVENT_TYPES = ['sale', 'entertainment', 'exhibition', 'food_festival', 'kids_event', 'seasonal', 'other'];

  return (
    <div className="animate-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <div className="page-title">Events Management</div>
          <div className="page-subtitle">Create and manage mall events</div>
        </div>
        <button className="btn btn-primary" onClick={openCreate}><Plus size={16} /> New Event</button>
      </div>

      {loading ? (
        <div className="loading"><div className="spinner" /></div>
      ) : events.length === 0 ? (
        <div className="empty-state"><Calendar size={48} /><p>No events yet</p></div>
      ) : (
        <div className="grid grid-2">
          {events.map(ev => (
            <div key={ev._id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div style={{ flex: 1 }}>
                  <span className="badge badge-gold" style={{ fontSize: '11px', marginBottom: '6px', display: 'inline-block' }}>{ev.event_type?.replace('_', ' ')}</span>
                  <div style={{ fontWeight: 600, fontSize: '15px' }}>{ev.name}</div>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button className="btn btn-ghost" style={{ padding: '6px' }} onClick={() => openEdit(ev)}><Edit2 size={14} /></button>
                  <button className="btn btn-danger" style={{ padding: '6px' }} onClick={() => handleDelete(ev._id)}><Trash2 size={14} /></button>
                </div>
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: 1.5 }}>{ev.description}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={12} />{ev.location_in_mall}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={12} />{new Date(ev.start_time).toLocaleString()}</span>
                {ev.max_capacity && <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Users size={12} />{ev.current_attendance}/{ev.max_capacity}</span>}
              </div>
              <div style={{ marginTop: '10px', display: 'flex', gap: '8px' }}>
                <span className={`badge ${ev.is_active ? 'badge-success' : 'badge-danger'}`}>{ev.is_active ? 'Active' : 'Cancelled'}</span>
                {ev.is_free ? <span className="badge badge-info">Free</span> : <span className="badge badge-warning">Rs.{ev.ticket_price}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '20px' }}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '28px', width: '100%', maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px' }}>{editing ? 'Edit Event' : 'Create New Event'}</h2>
              <button className="btn btn-ghost" style={{ padding: '6px' }} onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Event Name *</label>
                <input placeholder="e.g. Spring Food Festival" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea placeholder="Describe the event..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} required />
              </div>
              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">Event Type *</label>
                  <select value={form.event_type} onChange={e => setForm({ ...form, event_type: e.target.value })}>
                    {EVENT_TYPES.map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Location *</label>
                  <input placeholder="Main Atrium Level 1" value={form.location_in_mall} onChange={e => setForm({ ...form, location_in_mall: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Start Time *</label>
                  <input type="datetime-local" value={form.start_time} onChange={e => setForm({ ...form, start_time: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">End Time *</label>
                  <input type="datetime-local" value={form.end_time} onChange={e => setForm({ ...form, end_time: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Max Capacity</label>
                  <input type="number" placeholder="500" value={form.max_capacity} onChange={e => setForm({ ...form, max_capacity: e.target.value })} min="0" />
                </div>
                <div className="form-group">
                  <label className="form-label">Ticket Price</label>
                  <input type="number" placeholder="0 for free" value={form.ticket_price} onChange={e => setForm({ ...form, ticket_price: e.target.value, is_free: !e.target.value || e.target.value === '0' })} min="0" />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? <span className="spinner" style={{ width: '16px', height: '16px' }} /> : editing ? 'Save Changes' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
