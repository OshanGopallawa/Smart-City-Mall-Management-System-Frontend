import React, { useState, useEffect } from 'react';
import { operatorService, mallService } from '../../services/api';
import { Building2, Plus, Edit2, Trash2, X, MapPin, Phone, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = ['Fashion', 'Electronics', 'Food & Beverage', 'Entertainment', 'Health & Beauty', 'Sports', 'Books', 'Toys', 'Other'];

export default function OperatorStores() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', category: 'Sports', floor: '1', unit_number: '', description: '', contact_phone: '', contact_email: '' });
  const [saving, setSaving] = useState(false);

  const fetchStores = async () => {
    setLoading(true);
    try {
      const res = await mallService.getStores({ limit: 50 });
      setStores(res.data.data || []);
    } catch { toast.error('Failed to load stores'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchStores(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', category: 'Sports', floor: '1', unit_number: '', description: '', contact_phone: '', contact_email: '' });
    setShowModal(true);
  };

  const openEdit = (store) => {
    setEditing(store);
    setForm({ name: store.name, category: store.category, floor: store.floor, unit_number: store.unit_number, description: store.description || '', contact_phone: store.contact_phone || '', contact_email: store.contact_email || '' });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await operatorService.updateStore(editing._id, form);
        toast.success('Store updated!');
      } else {
        await operatorService.createStore(form);
        toast.success('Store created!');
      }
      setShowModal(false);
      fetchStores();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save store');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Deactivate "${name}"?`)) return;
    try {
      await mallService.deleteStore(id);
      toast.success('Store deactivated');
      fetchStores();
    } catch { toast.error('Failed to deactivate store'); }
  };

  return (
    <div className="animate-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <div className="page-title">Store Management</div>
          <div className="page-subtitle">Create and manage mall stores</div>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <Plus size={16} /> New Store
        </button>
      </div>

      {loading ? (
        <div className="loading"><div className="spinner" /></div>
      ) : stores.length === 0 ? (
        <div className="empty-state"><Building2 size={48} /><p>No stores yet. Create your first store.</p></div>
      ) : (
        <div className="grid grid-3">
          {stores.map(store => (
            <div key={store._id} className="card" style={{ transition: 'border-color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent-border)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '16px', marginBottom: '4px' }}>{store.name}</div>
                  <span className="badge badge-gold" style={{ fontSize: '11px' }}>{store.category}</span>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button className="btn btn-ghost" style={{ padding: '6px', borderRadius: '6px' }} onClick={() => openEdit(store)}>
                    <Edit2 size={14} />
                  </button>
                  <button className="btn btn-danger" style={{ padding: '6px', borderRadius: '6px' }} onClick={() => handleDelete(store._id, store.name)}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              {store.description && (
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {store.description}
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={12} /> Floor {store.floor} · {store.unit_number}</span>
                {store.contact_phone && <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Phone size={12} /> {store.contact_phone}</span>}
                {store.contact_email && <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Mail size={12} /> {store.contact_email}</span>}
              </div>
              <div className="divider" style={{ margin: '12px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className={`badge ${store.is_active ? 'badge-success' : 'badge-danger'}`}>{store.is_active ? 'Active' : 'Inactive'}</span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{store._id.slice(-8)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '20px' }}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '28px', width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px' }}>{editing ? 'Edit Store' : 'Create New Store'}</h2>
              <button className="btn btn-ghost" style={{ padding: '6px' }} onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">Store Name *</label>
                  <input placeholder="e.g. Nike Store" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Floor *</label>
                  <input placeholder="e.g. 1" value={form.floor} onChange={e => setForm({ ...form, floor: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Unit Number *</label>
                  <input placeholder="e.g. A-101" value={form.unit_number} onChange={e => setForm({ ...form, unit_number: e.target.value })} required={!editing} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea placeholder="Store description..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} />
              </div>
              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input placeholder="0112345678" value={form.contact_phone} onChange={e => setForm({ ...form, contact_phone: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input type="email" placeholder="store@mall.com" value={form.contact_email} onChange={e => setForm({ ...form, contact_email: e.target.value })} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? <span className="spinner" style={{ width: '16px', height: '16px' }} /> : editing ? 'Save Changes' : 'Create Store'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
