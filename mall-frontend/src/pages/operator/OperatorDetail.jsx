import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { operatorService } from '../../services/api';
import { ArrowLeft, Edit2, Lock, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function OperatorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [operator, setOperator] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [form, setForm] = useState({});
  const [pwForm, setPwForm] = useState({ current_password: '', new_password: '' });
  const [saving, setSaving] = useState(false);
  const [savingPw, setSavingPw] = useState(false);

  const fetchOperator = async () => {
    setLoading(true);
    try {
      const res = await operatorService.getById(id);
      setOperator(res.data.data);
      setForm(res.data.data);
    } catch (err) {
      toast.error('Failed to load operator');
      navigate('/operator/manage');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOperator();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await operatorService.update(id, form);
      toast.success('Operator updated!');
      setOperator(form);
      setEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setSavingPw(true);
    try {
      await operatorService.changePassword(id, pwForm);
      toast.success('Password changed!');
      setPwForm({ current_password: '', new_password: '' });
      setShowPasswordModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setSavingPw(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Deactivate "${operator.name}"?`)) return;
    try {
      await operatorService.delete(id);
      toast.success('Operator deactivated');
      navigate('/operator/manage');
    } catch (err) {
      toast.error('Failed to deactivate');
    }
  };

  if (loading) return <div className="loading"><div className="spinner" /></div>;
  if (!operator) return <div className="empty-state"><p>Operator not found</p></div>;

  const roleColors = {
    store_manager: 'var(--info)',
    mall_admin: 'var(--warning)',
    super_admin: 'var(--accent)',
  };

  return (
    <div className="animate-in">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <button className="btn btn-ghost" onClick={() => navigate('/operator/manage')} style={{ padding: '6px' }}>
          <ArrowLeft size={16} />
        </button>
        <div>
          <div className="page-title">{operator.name}</div>
          <div className="page-subtitle">Operator ID: {operator._id?.slice(-8)}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        {/* Main Info */}
        <div>
          {/* Profile Card */}
          <div className="card" style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 600 }}>Operator Information</h2>
              {!editing && (
                <button className="btn btn-primary" onClick={() => setEditing(true)} style={{ gap: '6px' }}>
                  <Edit2 size={14} /> Edit
                </button>
              )}
            </div>

            {editing ? (
              <form onSubmit={handleUpdate}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Email (Read-only)</label>
                  <input value={form.email || ''} disabled style={{ opacity: 0.5 }} />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input value={form.phone || ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Store Name</label>
                  <input value={form.store_name || ''} onChange={(e) => setForm({ ...form, store_name: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Role</label>
                  <select value={form.role || ''} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                    <option value="store_manager">Store Manager</option>
                    <option value="mall_admin">Mall Admin</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => { setEditing(false); setForm(operator); }}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? <span className="spinner" style={{ width: '16px', height: '16px' }} /> : 'Save Changes'}
                  </button>
                </div>
              </form>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Full Name</div>
                  <div style={{ fontSize: '14px', fontWeight: 500 }}>{operator.name}</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Email</div>
                  <div style={{ fontSize: '14px', fontWeight: 500, fontFamily: 'var(--font-mono)' }}>{operator.email}</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Phone</div>
                  <div style={{ fontSize: '14px', fontWeight: 500 }}>{operator.phone || '—'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Store Name</div>
                  <div style={{ fontSize: '14px', fontWeight: 500 }}>{operator.store_name || '—'}</div>
                </div>
              </div>
            )}
          </div>

          {/* Password Change Modal */}
          {showPasswordModal && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '28px', width: '100%', maxWidth: '420px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h2 style={{ fontSize: '18px', fontWeight: 600 }}>Change Password</h2>
                  <button className="btn btn-ghost" onClick={() => setShowPasswordModal(false)} style={{ padding: '4px' }}>
                    <X size={16} />
                  </button>
                </div>
                <form onSubmit={handlePasswordChange}>
                  <div className="form-group">
                    <label className="form-label">Current Password</label>
                    <input
                      type="password"
                      value={pwForm.current_password}
                      onChange={(e) => setPwForm({ ...pwForm, current_password: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">New Password</label>
                    <input
                      type="password"
                      placeholder="Min 8 chars, uppercase + number"
                      value={pwForm.new_password}
                      onChange={(e) => setPwForm({ ...pwForm, new_password: e.target.value })}
                      required
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                    <button type="button" className="btn btn-secondary" onClick={() => setShowPasswordModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={savingPw}>
                      {savingPw ? <span className="spinner" style={{ width: '16px', height: '16px' }} /> : 'Change Password'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div>
          {/* Status Card */}
          <div className="card" style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Status</div>
              <span className={`badge ${operator.is_active ? 'badge-success' : 'badge-danger'}`}>
                {operator.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>

          {/* Role Card */}
          <div className="card" style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: '12px' }}>Role</div>
            <span className="badge" style={{ background: `${roleColors[operator.role]}20`, color: roleColors[operator.role], textTransform: 'capitalize', fontSize: '13px' }}>
              {operator.role?.replace('_', ' ')}
            </span>
          </div>

          {/* Actions */}
          <div className="card">
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: '12px' }}>Actions</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                className="btn btn-secondary"
                onClick={() => setShowPasswordModal(true)}
                style={{ justifyContent: 'center', gap: '6px' }}
              >
                <Lock size={14} /> Change Password
              </button>
              <button
                className="btn btn-danger"
                onClick={handleDelete}
                style={{ justifyContent: 'center', gap: '6px' }}
              >
                <Trash2 size={14} /> Deactivate Operator
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}