import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import {
  LayoutDashboard, Store, Tag, Calendar, Users, BarChart3,
  ShoppingBag, LogOut, Menu, X, ChevronRight, Settings,
  TrendingUp, Building2, Bell, UserCircle, Activity
} from 'lucide-react';

const navItems = {
  user: [
    { to: '/user/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/user/stores', icon: Store, label: 'Browse Stores' },
    { to: '/user/deals', icon: Tag, label: 'Active Deals' },
    { to: '/user/events', icon: Calendar, label: 'Events' },
    { to: '/user/visits', icon: ShoppingBag, label: 'My Visits' },
    { to: '/user/profile', icon: UserCircle, label: 'Profile' },
  ],
  operator: [
    { to: '/operator/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/operator/stores', icon: Building2, label: 'My Store' },
    { to: '/operator/deals', icon: Tag, label: 'Deals' },
    { to: '/operator/events', icon: Calendar, label: 'Events' },
    { to: '/operator/operators', icon: Users, label: 'Operators', adminOnly: true },
    { to: '/operator/analytics', icon: BarChart3, label: 'Analytics' },
    { to: '/operator/profile', icon: Settings, label: 'Profile' },
  ],
};

export default function Layout({ children }) {
  const { currentUser, authType, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const items = navItems[authType] || [];
  const isAdmin = ['mall_admin', 'super_admin'].includes(currentUser?.role);

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{
        width: collapsed ? '64px' : 'var(--sidebar-width)',
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.25s ease',
        position: 'fixed',
        top: 0, left: 0, bottom: 0,
        zIndex: 100,
        overflow: 'hidden',
      }}>
        {/* Logo */}
        <div style={{
          padding: collapsed ? '20px 16px' : '20px 20px',
          borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', gap: '12px',
          height: 'var(--header-height)',
        }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '8px',
            background: 'var(--accent)', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Building2 size={18} color="#0a0a0f" />
          </div>
          {!collapsed && (
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 600, color: 'var(--accent)', lineHeight: 1.1 }}>SmartMall</div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {authType === 'operator' ? 'Management' : 'Shopper'}
              </div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto' }}>
          {items.filter(i => !i.adminOnly || isAdmin).map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} style={({ isActive }) => ({
              display: 'flex', alignItems: 'center',
              gap: '10px', padding: '10px 12px',
              borderRadius: 'var(--radius-sm)', marginBottom: '2px',
              fontSize: '14px', fontWeight: 500,
              color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
              background: isActive ? 'var(--accent-dim)' : 'transparent',
              border: isActive ? '1px solid var(--accent-border)' : '1px solid transparent',
              transition: 'all 0.15s',
              textDecoration: 'none',
              whiteSpace: 'nowrap', overflow: 'hidden',
            })}>
              <Icon size={18} style={{ flexShrink: 0 }} />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User info + logout */}
        <div style={{ padding: '12px 8px', borderTop: '1px solid var(--border)' }}>
          {!collapsed && currentUser && (
            <div style={{ padding: '10px 12px', marginBottom: '8px' }}>
              <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {currentUser.name}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                {currentUser.role || currentUser.membership_level}
              </div>
            </div>
          )}
          <button onClick={handleLogout} className="btn btn-ghost" style={{ width: '100%', justifyContent: collapsed ? 'center' : 'flex-start', padding: '10px 12px', borderRadius: 'var(--radius-sm)', gap: '10px' }}>
            <LogOut size={18} />
            {!collapsed && 'Sign out'}
          </button>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            position: 'absolute', right: '-12px', top: '76px',
            width: '24px', height: '24px', borderRadius: '50%',
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'var(--text-secondary)',
            transition: 'transform 0.25s',
            transform: collapsed ? 'rotate(0deg)' : 'rotate(180deg)',
          }}>
          <ChevronRight size={12} />
        </button>
      </aside>

      {/* Main content */}
      <main style={{
        marginLeft: collapsed ? '64px' : 'var(--sidebar-width)',
        flex: 1, transition: 'margin-left 0.25s ease',
        minHeight: '100vh',
      }}>
        {/* Top header */}
        <header style={{
          height: 'var(--header-height)',
          background: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          position: 'sticky', top: 0, zIndex: 50,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Activity size={16} color="var(--accent)" />
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Smart City Mall Management System
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              padding: '4px 12px', borderRadius: '20px',
              background: authType === 'operator' ? 'var(--accent-dim)' : 'var(--info-dim)',
              border: `1px solid ${authType === 'operator' ? 'var(--accent-border)' : 'rgba(96,165,250,0.2)'}`,
              fontSize: '12px', fontWeight: 500,
              color: authType === 'operator' ? 'var(--accent)' : 'var(--info)',
            }}>
              {authType === 'operator' ? `Operator · ${currentUser?.role?.replace('_', ' ')}` : `Shopper · ${currentUser?.membership_level}`}
            </div>
          </div>
        </header>

        <div style={{ padding: '28px 28px' }}>
          {children}
        </div>
      </main>
    </div>
  );
}
