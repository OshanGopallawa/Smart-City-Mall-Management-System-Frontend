import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { operatorService, analyticsService } from '../../services/api';
import { Store, Tag, Calendar, Users, TrendingUp, BarChart3, Building2, ArrowUpRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function OperatorDashboard() {
  const { operator } = useAuth();
  const [summary, setSummary] = useState(null);
  const [footfall, setFootfall] = useState([]);
  const [popularStores, setPopularStores] = useState([]);
  const [myStore, setMyStore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      analyticsService.summary(),
      analyticsService.dailyFootfall({ days: 7 }),
      analyticsService.popularStores({ days: 30, limit: 5 }),
      operatorService.myStore().catch(() => null),
    ]).then(([sum, ff, ps, ms]) => {
      setSummary(sum.data.data);
      setFootfall(ff.data.data || []);
      setPopularStores(ps.data.data || []);
      if (ms) setMyStore(ms.data.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
      return (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', padding: '8px 12px' }}>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>{label}</p>
          {payload.map((p, i) => (
            <p key={i} style={{ fontSize: '13px', color: p.color, fontWeight: 500 }}>{p.name}: {p.value}</p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) return <div className="loading"><div className="spinner" /></div>;

  const isAdmin = ['mall_admin', 'super_admin'].includes(operator?.role);

  return (
    <div className="animate-in">
      {/* Header banner */}
      <div style={{
        borderRadius: 'var(--radius-lg)', padding: '24px 28px', marginBottom: '24px',
        background: 'var(--bg-card)', border: '1px solid var(--accent-border)',
        backgroundImage: `url('https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=40')`,
        backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,10,15,0.88)', borderRadius: 'var(--radius-lg)' }} />
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', marginBottom: '4px' }}>
              Good day, {operator?.name?.split(' ')[0]}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              {isAdmin ? 'Full mall management access' : `Managing: ${operator?.store_name || 'No store assigned'}`}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{ padding: '8px 16px', borderRadius: 'var(--radius-sm)', background: 'var(--accent-dim)', border: '1px solid var(--accent-border)', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Role</div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--accent)', textTransform: 'capitalize', marginTop: '2px' }}>
                {operator?.role?.replace('_', ' ')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary stats */}
      {summary && (
        <div className="grid grid-4" style={{ marginBottom: '24px' }}>
          {[
            { label: 'Total Visits', value: summary.store_visits?.total || 0, sub: `${summary.store_visits?.today || 0} today`, icon: TrendingUp, color: 'var(--accent)' },
            { label: 'Deal Clicks', value: summary.deal_clicks?.total || 0, icon: Tag, color: 'var(--success)' },
            { label: 'Event Attendance', value: summary.event_attendance?.total || 0, icon: Calendar, color: 'var(--info)' },
            { label: 'Activity Logs', value: summary.activity_logs?.total || 0, icon: BarChart3, color: 'var(--warning)' },
          ].map(({ label, value, sub, icon: Icon, color }) => (
            <div key={label} className="stat-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div className="stat-value" style={{ fontSize: '28px' }}>{value.toLocaleString()}</div>
                  <div className="stat-label">{label}</div>
                  {sub && <div style={{ fontSize: '11px', color: 'var(--accent)', marginTop: '4px' }}>{sub}</div>}
                </div>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={20} color={color} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-2">
        {/* Daily footfall chart */}
        <div className="card">
          <div className="section-title"><TrendingUp size={16} color="var(--accent)" /> Daily Footfall (7 days)</div>
          {footfall.length === 0 ? (
            <div className="empty-state" style={{ padding: '40px' }}><p>No footfall data yet</p></div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={footfall}>
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} tickFormatter={d => d?.slice(5)} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="visit_count" stroke="var(--accent)" strokeWidth={2} dot={{ fill: 'var(--accent)', r: 4 }} name="Visits" />
                <Line type="monotone" dataKey="unique_visitors" stroke="var(--info)" strokeWidth={2} dot={{ fill: 'var(--info)', r: 4 }} name="Unique" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Popular stores */}
        <div className="card">
          <div className="section-title"><Store size={16} color="var(--accent)" /> Popular Stores</div>
          {popularStores.length === 0 ? (
            <div className="empty-state" style={{ padding: '40px' }}><p>No store visit data yet</p></div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {popularStores.map((s, i) => (
                <div key={s.store_id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 600, color: 'var(--accent)' }}>
                    {i + 1}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {s.store_name || s.store_id}
                    </div>
                    <div style={{ height: '4px', background: 'var(--bg-hover)', borderRadius: '2px', marginTop: '4px' }}>
                      <div style={{ height: '100%', background: 'var(--accent)', borderRadius: '2px', width: `${Math.min(100, (s.visit_count / (popularStores[0]?.visit_count || 1)) * 100)}%` }} />
                    </div>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent)', flexShrink: 0 }}>{s.visit_count}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* My store preview */}
      {myStore && (
        <div style={{ marginTop: '20px' }} className="card">
          <div className="section-title"><Building2 size={16} color="var(--accent)" /> My Store</div>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <div style={{
              width: '80px', height: '80px', borderRadius: 'var(--radius)',
              backgroundImage: `url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&q=60')`,
              backgroundSize: 'cover', flexShrink: 0,
            }} />
            <div>
              <div style={{ fontSize: '18px', fontWeight: 600, fontFamily: 'var(--font-display)', marginBottom: '4px' }}>{myStore.name}</div>
              <div style={{ display: 'flex', gap: '12px', fontSize: '13px', color: 'var(--text-muted)' }}>
                <span>{myStore.category}</span>
                <span>Floor {myStore.floor}</span>
                <span>{myStore.unit_number}</span>
                <span className={`badge ${myStore.is_active ? 'badge-success' : 'badge-danger'}`}>{myStore.is_active ? 'Active' : 'Inactive'}</span>
              </div>
              {myStore.deals?.length > 0 && (
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '6px' }}>
                  {myStore.deals.length} active deal{myStore.deals.length !== 1 ? 's' : ''}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
