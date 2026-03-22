import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Settings, ArrowRight, Star, Zap, Shield } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>

      {/* Background image with overlay */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0,
        backgroundImage: `url('https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=1920&q=80')`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        filter: 'brightness(0.25)',
      }} />
      <div style={{
        position: 'fixed', inset: 0, zIndex: 1,
        background: 'linear-gradient(135deg, rgba(10,10,15,0.95) 0%, rgba(10,10,15,0.7) 50%, rgba(201,168,76,0.08) 100%)',
      }} />

      {/* Grid pattern overlay */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 2,
        backgroundImage: `linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
        opacity: 0.3,
      }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 10 }}>

        {/* Nav */}
        <nav style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 60px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '10px',
              background: 'var(--accent)', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <ShoppingBag size={20} color="#0a0a0f" />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, color: 'var(--accent)' }}>SmartMall</div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>City Management System</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn btn-secondary" onClick={() => navigate('/login')}>Sign In</button>
            <button className="btn btn-primary" onClick={() => navigate('/register')}>Get Started</button>
          </div>
        </nav>

        {/* Hero */}
        <div style={{
          maxWidth: '900px', margin: '0 auto',
          padding: '100px 40px 60px',
          textAlign: 'center',
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 16px', borderRadius: '20px',
            background: 'var(--accent-dim)', border: '1px solid var(--accent-border)',
            fontSize: '12px', color: 'var(--accent)', fontWeight: 500,
            marginBottom: '32px', letterSpacing: '0.05em',
          }}>
            <Zap size={12} /> Smart City Mall Management Platform
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(42px, 6vw, 80px)',
            fontWeight: 700, lineHeight: 1.05,
            color: 'var(--text-primary)', marginBottom: '24px',
          }}>
            The Future of<br />
            <span style={{
              background: 'linear-gradient(135deg, var(--accent), var(--accent-light))',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>Mall Management</span>
          </h1>

          <p style={{
            fontSize: '18px', color: 'var(--text-secondary)',
            maxWidth: '560px', margin: '0 auto 48px',
            lineHeight: 1.7,
          }}>
            A complete microservices platform connecting shoppers, store operators, and mall administration in one unified system.
          </p>

          {/* Two portals */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', maxWidth: '600px', margin: '0 auto 60px' }}>
            <div
              onClick={() => navigate('/login?type=user')}
              style={{
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)', padding: '28px 24px',
                cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-border)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{
                width: '44px', height: '44px', borderRadius: '10px',
                background: 'var(--info-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px',
              }}>
                <ShoppingBag size={20} color="var(--info)" />
              </div>
              <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '6px' }}>Shopper Portal</div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: 1.5 }}>Browse stores, deals, and events as a shopper</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--info)' }}>
                Enter <ArrowRight size={14} />
              </div>
            </div>

            <div
              onClick={() => navigate('/operator/login')}
              style={{
                background: 'var(--bg-card)', border: '1px solid var(--accent-border)',
                borderRadius: 'var(--radius-lg)', padding: '28px 24px',
                cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left',
                position: 'relative', overflow: 'hidden',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(201,168,76,0.2)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ position: 'absolute', top: 0, right: 0, width: '80px', height: '80px', background: 'radial-gradient(circle, rgba(201,168,76,0.15), transparent)', borderRadius: '0 16px 0 80px' }} />
              <div style={{
                width: '44px', height: '44px', borderRadius: '10px',
                background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px',
              }}>
                <Settings size={20} color="var(--accent)" />
              </div>
              <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '6px' }}>Operator Portal</div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: 1.5 }}>Manage stores, deals, events and analytics</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--accent)' }}>
                Manage <ArrowRight size={14} />
              </div>
            </div>
          </div>

          {/* Features */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', maxWidth: '700px', margin: '0 auto' }}>
            {[
              { icon: Zap, label: '4 Microservices', desc: 'Independent services on Docker' },
              { icon: Shield, label: 'JWT Secured', desc: 'Role-based access control' },
              { icon: Star, label: 'MongoDB Atlas', desc: 'Cloud database storage' },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} style={{
                padding: '16px', borderRadius: 'var(--radius)',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--border)',
                textAlign: 'center',
              }}>
                <Icon size={20} color="var(--accent)" style={{ marginBottom: '8px' }} />
                <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>{label}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
