import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { operatorService } from '../../services/api';
import { Users, Search, Filter, Eye, Edit2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function OperatorManagement() {
  const navigate = useNavigate();
  const [operators, setOperators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  const fetchOperators = async (pageNum = 1, searchTerm = '', role = '') => {
    setLoading(true);
    try {
      const res = await operatorService.getAll({
        page: pageNum,
        limit: 20,
        search: searchTerm,
        role: role || undefined,
      });
      setOperators(res.data.data || []);
      setPagination(res.data.pagination || {});
    } catch (err) {
      toast.error('Failed to load operators');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOperators(1, '', '');
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    setPage(1);
    fetchOperators(1, value, roleFilter);
  };

  const handleRoleFilter = (e) => {
    const value = e.target.value;
    setRoleFilter(value);
    setPage(1);
    fetchOperators(1, search, value);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Deactivate "${name}"?`)) return;
    try {
      await operatorService.delete(id);
      toast.success('Operator deactivated');
      fetchOperators(page, search, roleFilter);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to deactivate');
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    fetchOperators(newPage, search, roleFilter);
  };

  const roleColors = {
    store_manager: 'var(--info)',
    mall_admin: 'var(--warning)',
    super_admin: 'var(--accent)',
  };

  if (loading) return <div className="loading"><div className="spinner" /></div>;

  return (
    <div className="animate-in">
      <div style={{ marginBottom: '24px' }}>
        <div className="page-title">Operator Management</div>
        <div className="page-subtitle">Manage mall operators and administrators</div>
      </div>

      {/* Search & Filter */}
      <div className="card" style={{ marginBottom: '20px', padding: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-hover)', borderRadius: 'var(--radius)', padding: '8px 12px', border: '1px solid var(--border)' }}>
            <Search size={16} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={handleSearch}
              style={{ background: 'none', border: 'none', outline: 'none', flex: 1, color: 'var(--text-primary)' }}
            />
          </div>
          <select value={roleFilter} onChange={handleRoleFilter} style={{ padding: '8px 12px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg-hover)' }}>
            <option value="">All Roles</option>
            <option value="store_manager">Store Manager</option>
            <option value="mall_admin">Mall Admin</option>
            <option value="super_admin">Super Admin</option>
          </select>
        </div>
      </div>

      {/* Operators Table */}
      {operators.length === 0 ? (
        <div className="empty-state" style={{ padding: '60px' }}>
          <Users size={48} />
          <p>No operators found</p>
        </div>
      ) : (
        <div className="card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Store</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {operators.map((op) => (
                  <tr key={op._id}>
                    <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{op.name}</td>
                    <td style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{op.email}</td>
                    <td>
                      <span className="badge" style={{ background: `${roleColors[op.role]}20`, color: roleColors[op.role], fontSize: '11px', textTransform: 'capitalize' }}>
                        {op.role?.replace('_', ' ')}
                      </span>
                    </td>
                    <td style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{op.store_name || '—'}</td>
                    <td>
                      <span className={`badge ${op.is_active ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '11px' }}>
                        {op.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          className="btn btn-ghost"
                          style={{ padding: '4px 8px', fontSize: '12px' }}
                          onClick={() => navigate(`/operator/view/${op._id}`)}
                          title="View details"
                        >
                          <Eye size={13} />
                        </button>
                        <button
                          className="btn btn-ghost"
                          style={{ padding: '4px 8px', fontSize: '12px' }}
                          onClick={() => navigate(`/operator/edit/${op._id}`)}
                          title="Edit operator"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          className="btn btn-danger"
                          style={{ padding: '4px 8px', fontSize: '12px' }}
                          onClick={() => handleDelete(op._id, op.name)}
                          title="Deactivate operator"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '20px', padding: '0 16px 16px' }}>
              <button
                className="btn btn-secondary"
                disabled={page === 1}
                onClick={() => handlePageChange(page - 1)}
              >
                Previous
              </button>
              {Array.from({ length: pagination.totalPages || 1 }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  className={`btn ${page === p ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => handlePageChange(p)}
                  style={{ minWidth: '32px' }}
                >
                  {p}
                </button>
              ))}
              <button
                className="btn btn-secondary"
                disabled={page === pagination.totalPages}
                onClick={() => handlePageChange(page + 1)}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}