import React, { useState, useEffect } from 'react';
import { analyticsService } from '../../services/api';
import { BarChart3, TrendingUp, Users, Tag, Calendar, Activity, Trash2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import toast from 'react-hot-toast';

const COLORS = ['#c9a84c', '#60a5fa', '#4ade80', '#fbbf24', '#f87171'];

export default function AnalyticsDashboard() {
  const [summary, setSummary] = useState(null);
  const [footfall, setFootfall] = useState([]);
  const [popularStores, setPopularStores] = useState([]);
  const [popularDeals, setPopularDeals] = useState([]);
  const [eventStats, setEventStats] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(7);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [sum, ff, ps, pd, es, au, lg] = await Promise.all([
        analyticsService.summary(),
        analyticsService.dailyFootfall({ days }),
        analyticsService.popularStores({ days: 30, limit: 5 }),
        analyticsService.popularDeals({ days: 30, limit: 5 }),
        analyticsService.eventAttendance(),
        analyticsService.activeUsers({ days: 30, limit: 5 }),
        analyticsService.logs({ limit: 20 }),
      ]);
      setSummary(sum.data.data);
      setFootfall(ff.data.data || []);
      setPopularStores(ps.data.data || []);
      setPopularDeals(pd.data.data || []);
      setEventStats(es.data.data || []);
      setActiveUsers(au.data.data || []);
      setLogs(lg.data.data || []);
    } catch (err) {
      toast.error('Failed to load analytics');
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, [days]);

  const deleteLog = async (id) => {
    try {
      await analyticsService.deleteLog(id);
      setLogs(logs.filter(l => l._id !== id));
      toast.success('Log deleted');
    } catch { toast.error('Failed to delete log'); }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', padding: '8px 12px' }}>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>{label}</p>
        {payload.map((p, i) => <p key={i} style={{ fontSize: '13px', color: p.color }}>{p.name}: <strong>{p.value}</strong></p>)}
      </div>
    );
  };

  const logColors = {
    user_registered: 'var(--success)', user_login: 'var(--info)',
    store_visit: 'var(--accent)', deal_created: 'var(--warning)',
    store_created: 'var(--accent)', mall_event_created: 'var(--info)',
  };

  if (loading) return <div className="loading"><div className="spinner" /></div>;

  return (
    <div className="animate-in">
      <div className="page-title">Analytics Dashboard</div>
      <div className="page-subtitle">Real-time mall performance metrics</div>

      {/* Summary cards */}
      {summary && (
        <div className="grid grid-4" style={{ marginBottom: '24px' }}>
          {[
            { label: 'Total Visits', value: summary.store_visits?.total, sub: `${summary.store_visits?.today} today`, color: 'var(--accent)', icon: TrendingUp },
            { label: 'This Month Visits', value: summary.store_visits?.this_month, color: 'var(--success)', icon: Activity },
            { label: 'Deal Clicks', value: summary.deal_clicks?.total, color: 'var(--info)', icon: Tag },
            { label: 'Event Attendance', value: summary.event_attendance?.total, color: 'var(--warning)', icon: Calendar },
          ].map(({ label, value, sub, color, icon: Icon }) => (
            <div key={label} className="stat-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div className="stat-value">{(value || 0).toLocaleString()}</div>
                  <div className="stat-label">{label}</div>
                  {sub && <div style={{ fontSize: '11px', color, marginTop: '4px' }}>{sub}</div>}
                </div>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={20} color={color} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Charts row 1 */}
      <div className="grid grid-2" style={{ marginBottom: '20px' }}>
        {/* Daily footfall */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div className="section-title" style={{ marginBottom: 0 }}><TrendingUp size={16} color="var(--accent)" /> Daily Footfall</div>
            <select value={days} onChange={e => setDays(+e.target.value)} style={{ width: 'auto', padding: '4px 8px', fontSize: '12px' }}>
              <option value={7}>7 days</option>
              <option value={14}>14 days</option>
              <option value={30}>30 days</option>
            </select>
          </div>
          {footfall.length === 0 ? (
            <div className="empty-state" style={{ padding: '40px' }}><p>No data yet. Send some store visit events.</p></div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={footfall}>
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} tickFormatter={d => d?.slice(5)} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="visit_count" stroke="var(--accent)" strokeWidth={2} dot={{ r: 3, fill: 'var(--accent)' }} name="Visits" />
                <Line type="monotone" dataKey="unique_visitors" stroke="var(--info)" strokeWidth={2} dot={{ r: 3, fill: 'var(--info)' }} name="Unique" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Popular stores */}
        <div className="card">
          <div className="section-title"><BarChart3 size={16} color="var(--accent)" /> Popular Stores</div>
          {popularStores.length === 0 ? (
            <div className="empty-state" style={{ padding: '40px' }}><p>No store visit data yet</p></div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={popularStores} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
                <YAxis type="category" dataKey="store_name" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} width={80} tickFormatter={v => v?.length > 10 ? v.slice(0, 10) + '…' : v} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="visit_count" fill="var(--accent)" radius={[0, 4, 4, 0]} name="Visits" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-2" style={{ marginBottom: '20px' }}>
        {/* Event attendance pie */}
        <div className="card">
          <div className="section-title"><Calendar size={16} color="var(--warning)" /> Event Attendance</div>
          {eventStats.length === 0 ? (
            <div className="empty-state" style={{ padding: '40px' }}><p>No event data yet</p></div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <ResponsiveContainer width={160} height={160}>
                <PieChart>
                  <Pie data={eventStats} dataKey="total_attendees" nameKey="event_name" cx="50%" cy="50%" innerRadius={40} outerRadius={70}>
                    {eventStats.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v, n) => [v, n]} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ flex: 1 }}>
                {eventStats.map((ev, i) => (
                  <div key={ev.event_id} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '12px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: COLORS[i % COLORS.length], flexShrink: 0 }} />
                    <div style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-secondary)' }}>{ev.event_name || 'Event'}</div>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', flexShrink: 0 }}>{ev.total_attendees}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Active users */}
        <div className="card">
          <div className="section-title"><Users size={16} color="var(--info)" /> Most Active Users</div>
          {activeUsers.length === 0 ? (
            <div className="empty-state" style={{ padding: '40px' }}><p>No user activity data yet</p></div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {activeUsers.map((u, i) => (
                <div key={u.user_id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: `${COLORS[i % COLORS.length]}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 600, color: COLORS[i % COLORS.length] }}>
                    {i + 1}
                  </div>
                  <div style={{ flex: 1, fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {u.user_id?.slice(-12)}...
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--info)' }}>{u.visit_count} visits</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Activity logs */}
      <div className="card">
        <div className="section-title"><Activity size={16} color="var(--accent)" /> Recent Activity Logs</div>
        {logs.length === 0 ? (
          <div className="empty-state"><p>No activity logs yet</p></div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Event Type</th>
                  <th>User ID</th>
                  <th>Store ID</th>
                  <th>Logged At</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {logs.map(log => (
                  <tr key={log._id}>
                    <td>
                      <span className="badge" style={{ background: `${logColors[log.event_type] || 'var(--accent)'}20`, color: logColors[log.event_type] || 'var(--accent)', fontSize: '11px' }}>
                        {log.event_type?.replace('_', ' ')}
                      </span>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}>{log.user_id?.slice(-10) || '—'}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}>{log.store_id?.slice(-10) || '—'}</td>
                    <td style={{ fontSize: '12px' }}>{new Date(log.logged_at).toLocaleString()}</td>
                    <td>
                      <button className="btn btn-danger" style={{ padding: '4px 8px', fontSize: '12px' }} onClick={() => deleteLog(log._id)}>
                        <Trash2 size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
