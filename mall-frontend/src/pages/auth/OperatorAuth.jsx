import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Settings, Eye, EyeOff, ArrowLeft } from 'lucide-react';

export function OperatorLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const { loginOperator } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginOperator(form.email, form.password);
      toast.success('Welcome back, operator!');
      navigate('/operator/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <OperatorAuthLayout
      title="Operator Portal"
      subtitle="Sign in to manage your mall operations"
      image="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80"
    >
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Operator Email</label>
          <input type="email" placeholder="manager@mall.com" value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })} required />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <div style={{ position: 'relative' }}>
            <input type={show ? 'text' : 'password'} placeholder="Your password"
              value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
              required style={{ paddingRight: '44px' }} />
            <button type="button" onClick={() => setShow(!show)}
              style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', color: 'var(--text-muted)', padding: 0 }}>
              {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '8px', padding: '12px' }} disabled={loading}>
          {loading ? <span className="spinner" style={{ width: '18px', height: '18px' }} /> : 'Sign In'}
        </button>
      </form>
      <div className="divider" />
      <p style={{ textAlign: 'center', fontSize: '14px', color: 'var(--text-muted)' }}>
        New operator? <Link to="/operator/register">Register here</Link>
      </p>
      <p style={{ textAlign: 'center', fontSize: '14px', color: 'var(--text-muted)', marginTop: '8px' }}>
        Are you a shopper? <Link to="/login">Shopper login</Link>
      </p>
    </OperatorAuthLayout>
  );
}

export function OperatorRegister() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'store_manager', store_name: '' });
  const [loading, setLoading] = useState(false);
  const { registerOperator } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerOperator(form);
      toast.success('Operator account created!');
      navigate('/operator/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <OperatorAuthLayout
      title="Register Operator"
      subtitle="Create a mall operator account"
      image="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80"
    >
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input placeholder="Store Manager" value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })} required />
        </div>
        <div className="form-group">
          <label className="form-label">Email address</label>
          <input type="email" placeholder="manager@mall.com" value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })} required />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input type="password" placeholder="Min 8 chars, uppercase + number"
            value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
        </div>
        <div className="form-group">
          <label className="form-label">Role</label>
          <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
            <option value="store_manager">Store Manager</option>
            <option value="mall_admin">Mall Admin</option>
            <option value="super_admin">Super Admin</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Store Name (optional)</label>
          <input placeholder="e.g. Nike Store" value={form.store_name}
            onChange={e => setForm({ ...form, store_name: e.target.value })} />
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '8px', padding: '12px' }} disabled={loading}>
          {loading ? <span className="spinner" style={{ width: '18px', height: '18px' }} /> : 'Create Account'}
        </button>
      </form>
      <div className="divider" />
      <p style={{ textAlign: 'center', fontSize: '14px', color: 'var(--text-muted)' }}>
        Already have an account? <Link to="/operator/login">Sign in</Link>
      </p>
    </OperatorAuthLayout>
  );
}

function OperatorAuthLayout({ children, title, subtitle, image }) {
  const navigate = useNavigate();
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '100vh' }}>
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url('${image}')`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.25)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(201,168,76,0.15), transparent)' }} />
        <div style={{ position: 'relative', zIndex: 1, padding: '40px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '36px', fontWeight: 700, color: 'var(--accent)', marginBottom: '12px' }}>
            Operator<br />Management
          </div>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', maxWidth: '300px', lineHeight: 1.6 }}>
            Control stores, manage deals, track analytics and grow your business.
          </p>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px', background: 'var(--bg-primary)' }}>
        <button onClick={() => navigate('/')} className="btn btn-ghost" style={{ alignSelf: 'flex-start', marginBottom: '40px', padding: '6px 0', gap: '6px' }}>
          <ArrowLeft size={16} /> Back
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Settings size={20} color="#0a0a0f" />
          </div>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'var(--font-display)' }}>{title}</h1>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{subtitle}</p>
          </div>
        </div>
        <div className="divider" style={{ marginBottom: '24px' }} />
        {children}
      </div>
    </div>
  );
}
