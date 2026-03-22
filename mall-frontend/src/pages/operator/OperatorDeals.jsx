import React, { useState, useEffect } from 'react';
import { operatorService, mallService } from '../../services/api';
import { Tag, Plus, Edit2, Trash2, X, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function OperatorDeals() {
  const [deals, setDeals] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    store_id: '', title: '', description: '',
    discount_type: 'percentage', discount_value: '', valid_until: '', original_price: ''
  });

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [d, s] = await Promise.all([mallService.getDeals(), mallService.getStores({ limit: 100 })]);
      setDeals(d.data.data || []);
      setStores(s.data.data || []);
    } catch { toast.error('Failed to load deals'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ store_id: stores[0]?._id || '', title: '', description: '', discount_type: 'percentage', discount_value: '', valid_until: '', original_price: '' });
    setShowModal(true);
  };

  const openEdit = (deal) => {
    setEditing(deal);
    setForm({
      store_id: deal.store_id?._id || deal.store_id,
      title: deal.title, description: deal.description,
      discount_type: deal.discount_type, discount_value: deal.discount_value,
      valid_until: deal.valid_until?.split('T')[0] || '',
      original_price: deal.original_price || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, discount_value: parseFloat(form.discount_value), valid_until: new Date(form.valid_until).toISOString() };
    if (form.original_price) payload.original_price = parseFloat(form.original_price);
    try {
      if (editing) {
        await mallService.updateDeal(editing._id, payload);
        toast.success('Deal updated!');
      } else {
        await operatorService.createDeal(payload);
        toast.success('Deal created!');
      }
      setShowModal(false);
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save deal');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deactivate this deal?')) return;
    try {
      await mallService.deleteDeal(id);
      toast.success('Deal deactivated');
      fetchAll();
    } catch { toast.error('Failed'); }
  };

  const typeColors = { percentage: 'var(--success)', fixed: 'var(--info)', buy_x_get_y: 'var(--warning)', bundle: 'var(--accent)' };

  return (
    <div className="animate-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <div className="page-title">Deals Management</div>
          <div className="page-subtitle">Create and manage store deals and discounts</div>
        </div>
        <button className="btn btn-primary" onClick={openCreate}><Plus size={16} /> New Deal</button>
      </div>

      {loading ? (
        <div className="loading"><div className="spinner" /></div>
      ) : deals.length === 0 ? (
        <div className="empty-state"><Tag size={48} /><p>No deals yet</p></div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Store</th>
                <th>Type</th>
                <th>Discount</th>
                <th>Valid Until</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {deals.map(deal => (
                <tr key={deal._id}>
                  <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{deal.title}</td>
                  <td>{deal.store_id?.name || '—'}</td>
                  <td>
                    <span className="badge" style={{ background: `${typeColors[deal.discount_type]}20`, color: typeColors[deal.discount_type], fontSize: '11px' }}>
                      {deal.discount_type?.replace('_', ' ')}
                    </span>
                  </td>
                  <td style={{ color: 'var(--success)', fontWeight: 600 }}>
                    {deal.discount_type === 'percentage' ? `${deal.discount_value}%` : `Rs.${deal.discount_value}`}
                  </td>
                  <td style={{ fontSize: '12px' }}>{new Date(deal.valid_until).toLocaleDateString()}</td>
                  <td><span className={`badge ${deal.is_active ? 'badge-success' : 'badge-danger'}`}>{deal.is_active ? 'Active' : 'Inactive'}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button className="btn btn-ghost" style={{ padding: '4px 8px', fontSize: '12px' }} onClick={() => openEdit(deal)}>
                        <Edit2 size={13} />
                      </button>
                      <button className="btn btn-danger" style={{ padding: '4px 8px', fontSize: '12px' }} onClick={() => handleDelete(deal._id)}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '20px' }}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '28px', width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px' }}>{editing ? 'Edit Deal' : 'Create New Deal'}</h2>
              <button className="btn btn-ghost" style={{ padding: '6px' }} onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Store *</label>
                <select value={form.store_id} onChange={e => setForm({ ...form, store_id: e.target.value })} required>
                  <option value="">Select store...</option>
                  {stores.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Deal Title *</label>
                <input placeholder="e.g. 50% off all shoes" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea placeholder="Details about this deal..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} required />
              </div>
              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">Discount Type *</label>
                  <select value={form.discount_type} onChange={e => setForm({ ...form, discount_type: e.target.value })}>
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                    <option value="buy_x_get_y">Buy X Get Y</option>
                    <option value="bundle">Bundle</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Discount Value *</label>
                  <input type="number" placeholder={form.discount_type === 'percentage' ? '50' : '500'} value={form.discount_value} onChange={e => setForm({ ...form, discount_value: e.target.value })} required min="0" />
                </div>
                <div className="form-group">
                  <label className="form-label">Valid Until *</label>
                  <input type="date" value={form.valid_until} onChange={e => setForm({ ...form, valid_until: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Original Price</label>
                  <input type="number" placeholder="5000" value={form.original_price} onChange={e => setForm({ ...form, original_price: e.target.value })} min="0" />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? <span className="spinner" style={{ width: '16px', height: '16px' }} /> : editing ? 'Save Changes' : 'Create Deal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
