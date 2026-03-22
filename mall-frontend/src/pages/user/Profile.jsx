import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userService, operatorService } from '../../services/api';
import { UserCircle, Lock, Save, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

export function UserProfile() {
  const { user, logout } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [pwForm, setPwForm] = useState({ current_password: '', new_password: '' });
  const [saving, setSaving] = useState(false);
  const [savingPw, setSavingPw] = useState(false);
  const userId = user?._id || user?.id;

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await userService.update(userId, form);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    } finally { setSaving(false); }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    setSavingPw(true);
    try {
      await userService.changePassword(userId, pwForm);
      toast.success('Password changed! Please login again.');
      setTimeout(() => logout(), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally { setSavingPw(false); }
  };

  const membershipColors = { bronze: '#cd7f32', silver: '#c0c0c0', gold: '#c9a84c', platinum: '#e5e4e2' };

  return (
    <div className="animate-in" style={{ maxWidth: '600px' }}>
      <div className="page-title">My Profile</div>
      <div className="page-subtitle">Manage your shopper account</div>

      {/* Profile header */}
      <div className="card" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{
          width: '72px', height: '72px', borderRadius: '50%',
          background: 'var(--accent-dim)', border: '2px solid var(--accent-border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '28px', fontFamily: 'var(--font-display)', color: 'var(--accent)', fontWeight: 700,
        }}>
          {user?.name?.charAt(0)?.toUpperCase()}
        </div>
        <div>
          <div style={{ fontSize: '20px', fontWeight: 600, fontFamily: 'var(--font-display)' }}>{user?.name}</div>
          <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px' }}>{user?.email}</div>
          <span className="badge" style={{ background: `${membershipColors[user?.membership_level]}20`, color: membershipColors[user?.membership_level], textTransform: 'capitalize' }}>
            {user?.membership_level} Member
          </span>
          <span className="badge badge-muted" style={{ marginLeft: '8px', fontSize: '11px' }}>{user?.membership_points || 0} points</span>
        </div>
      </div>

      {/* Edit profile */}
      <div className="card" style={{ marginBottom: '16px' }}>
        <div className="section-title"><UserCircle size={16} color="var(--accent)" /> Personal Information</div>
        <form onSubmit={handleUpdate}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input value={user?.email} disabled style={{ opacity: 0.5 }} />
            <div className="form-error" style={{ color: 'var(--text-muted)' }}>Email cannot be changed</div>
          </div>
          <div className="form-group">
            <label className="form-label">Phone</label>
            <input placeholder="0771234567" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          </div>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? <span className="spinner" style={{ width: '16px', height: '16px' }} /> : <><Save size={15} /> Save Changes</>}
          </button>
        </form>
      </div>

      {/* Change password */}
      <div className="card">
        <div className="section-title"><Lock size={16} color="var(--accent)" /> Change Password</div>
        <form onSubmit={handlePassword}>
          <div className="form-group">
            <label className="form-label">Current Password</label>
            <input type="password" value={pwForm.current_password} onChange={e => setPwForm({ ...pwForm, current_password: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">New Password</label>
            <input type="password" placeholder="Min 8 chars, uppercase + number" value={pwForm.new_password} onChange={e => setPwForm({ ...pwForm, new_password: e.target.value })} required />
          </div>
          <button type="submit" className="btn btn-secondary" disabled={savingPw}>
            {savingPw ? <span className="spinner" style={{ width: '16px', height: '16px' }} /> : <><Lock size={15} /> Update Password</>}
          </button>
        </form>
      </div>
    </div>
  );
}

export function OperatorProfile() {
  const { operator, logout } = useAuth();
  const [form, setForm] = useState({ name: operator?.name || '', phone: operator?.phone || '' });
  const [pwForm, setPwForm] = useState({ current_password: '', new_password: '' });
  const [saving, setSaving] = useState(false);
  const [savingPw, setSavingPw] = useState(false);
  const opId = operator?._id || operator?.id;

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await operatorService.update(opId, form);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    } finally { setSaving(false); }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    setSavingPw(true);
    try {
      await operatorService.changePassword(opId, pwForm);
      toast.success('Password changed! Please login again.');
      setTimeout(() => logout(), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally { setSavingPw(false); }
  };

  const roleColors = { store_manager: 'var(--info)', mall_admin: 'var(--warning)', super_admin: 'var(--accent)' };

  return (
    <div className="animate-in" style={{ maxWidth: '600px' }}>
      <div className="page-title">Operator Profile</div>
      <div className="page-subtitle">Manage your operator account</div>

      <div className="card" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{
          width: '72px', height: '72px', borderRadius: '50%',
          background: 'var(--accent-dim)', border: '2px solid var(--accent-border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '28px', fontFamily: 'var(--font-display)', color: 'var(--accent)', fontWeight: 700,
        }}>
          {operator?.name?.charAt(0)?.toUpperCase()}
        </div>
        <div>
          <div style={{ fontSize: '20px', fontWeight: 600, fontFamily: 'var(--font-display)' }}>{operator?.name}</div>
          <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px' }}>{operator?.email}</div>
          <span className="badge" style={{ background: `${roleColors[operator?.role]}20`, color: roleColors[operator?.role], textTransform: 'capitalize' }}>
            <Shield size={11} /> {operator?.role?.replace('_', ' ')}
          </span>
          {operator?.store_name && <span className="badge badge-gold" style={{ marginLeft: '8px' }}>{operator?.store_name}</span>}
        </div>
      </div>

      <div className="card" style={{ marginBottom: '16px' }}>
        <div className="section-title"><UserCircle size={16} color="var(--accent)" /> Personal Information</div>
        <form onSubmit={handleUpdate}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Phone</label>
            <input placeholder="0771234567" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          </div>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? <span className="spinner" style={{ width: '16px', height: '16px' }} /> : <><Save size={15} /> Save Changes</>}
          </button>
        </form>
      </div>

      <div className="card">
        <div className="section-title"><Lock size={16} color="var(--accent)" /> Change Password</div>
        <form onSubmit={handlePassword}>
          <div className="form-group">
            <label className="form-label">Current Password</label>
            <input type="password" value={pwForm.current_password} onChange={e => setPwForm({ ...pwForm, current_password: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">New Password</label>
            <input type="password" placeholder="Min 8 chars, uppercase + number" value={pwForm.new_password} onChange={e => setPwForm({ ...pwForm, new_password: e.target.value })} required />
          </div>
          <button type="submit" className="btn btn-secondary" disabled={savingPw}>
            {savingPw ? <span className="spinner" style={{ width: '16px', height: '16px' }} /> : <><Lock size={15} /> Update Password</>}
          </button>
        </form>
      </div>
    </div>
  );
}
