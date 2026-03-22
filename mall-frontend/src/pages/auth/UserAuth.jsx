import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { ShoppingBag, Eye, EyeOff, ArrowLeft } from 'lucide-react';

export function UserLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginUser(form.email, form.password);
      toast.success('Welcome back!');
      navigate('/user/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your shopper account"
      image="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80"
      icon={<ShoppingBag size={24} color="#0a0a0f" />}
      accentColor="var(--info)"
    >
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Email address</label>
          <input type="email" placeholder="john@example.com" value={form.email}
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
        Don't have an account? <Link to="/register">Create one</Link>
      </p>
      <p style={{ textAlign: 'center', fontSize: '14px', color: 'var(--text-muted)', marginTop: '8px' }}>
        Are you an operator? <Link to="/operator/login">Operator login</Link>
      </p>
    </AuthLayout>
  );
}

export function UserRegister() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const { registerUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerUser(form);
      toast.success('Account created! Welcome to SmartMall.');
      navigate('/user/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <AuthLayout
      title="Create account"
      subtitle="Join thousands of shoppers at SmartMall"
      image="https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&q=80"
      icon={<ShoppingBag size={24} color="#0a0a0f" />}
      accentColor="var(--info)"
    >
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Full name</label>
          <input placeholder="John Doe" value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })} required />
        </div>
        <div className="form-group">
          <label className="form-label">Email address</label>
          <input type="email" placeholder="john@example.com" value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })} required />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input type="password" placeholder="Min 8 chars, uppercase + number"
            value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
          <div className="form-error" style={{ color: 'var(--text-muted)' }}>Must contain uppercase, lowercase and a number</div>
        </div>
        <div className="form-group">
          <label className="form-label">Phone (optional)</label>
          <input placeholder="0771234567" value={form.phone}
            onChange={e => setForm({ ...form, phone: e.target.value })} />
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '8px', padding: '12px' }} disabled={loading}>
          {loading ? <span className="spinner" style={{ width: '18px', height: '18px' }} /> : 'Create Account'}
        </button>
      </form>
      <div className="divider" />
      <p style={{ textAlign: 'center', fontSize: '14px', color: 'var(--text-muted)' }}>
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </AuthLayout>
  );
}

function AuthLayout({ children, title, subtitle, image, icon, accentColor }) {
  const navigate = useNavigate();
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '100vh' }}>
      {/* Left panel - image */}
      <div style={{
        position: 'relative', overflow: 'hidden',
        background: 'var(--bg-secondary)',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url('${image}')`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          filter: 'brightness(0.35)',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, transparent, rgba(10,10,15,0.8))',
        }} />
        <div style={{ position: 'relative', zIndex: 1, padding: '40px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '36px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>
            Smart City<br />Mall
          </div>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', maxWidth: '300px', lineHeight: 1.6 }}>
            Sri Lanka's most advanced mall management platform.
          </p>
        </div>
      </div>

      {/* Right panel - form */}
      <div style={{
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '60px', background: 'var(--bg-primary)',
      }}>
        <button onClick={() => navigate('/')} className="btn btn-ghost"
          style={{ alignSelf: 'flex-start', marginBottom: '40px', padding: '6px 0', gap: '6px' }}>
          <ArrowLeft size={16} /> Back
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: accentColor || 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {icon}
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
