'use client';
import React, { useState, useEffect } from 'react';
import AdminGuard from '@/components/admin/common/AdminGuard';
import { apiGet, apiPost, apiPatch } from '@/lib/api/client';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: '', slug: '', parentId: '', sortOrder: 0 });
  const [openParents, setOpenParents] = useState({});

  useEffect(() => { fetchCategories(); }, []);

  async function fetchCategories() {
    try {
      const data = await apiGet('/api/admin/categories');
      setCategories(data || []);
      // 처음 로드 시 모든 부모 카테고리 열림
      const parents = (data || []).filter(c => !c.parentId);
      setOpenParents(prev => {
        const next = { ...prev };
        parents.forEach(p => { if (next[p.id] === undefined) next[p.id] = true; });
        return next;
      });
    } catch (e) { console.error(e); }
  }

  function buildTree() {
    const parents = categories.filter(c => !c.parentId);
    return parents.map(parent => ({
      ...parent,
      children: categories.filter(c => c.parentId === parent.id),
    }));
  }

  function toggleParent(id) {
    setOpenParents(prev => ({ ...prev, [id]: !prev[id] }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const data = { ...form, parentId: form.parentId ? parseInt(form.parentId) : null, sortOrder: parseInt(form.sortOrder) || 0 };
    try {
      if (editId) {
        await apiPatch(`/api/admin/categories/${editId}`, data);
      } else {
        await apiPost('/api/admin/categories', data);
      }
      setShowForm(false);
      setEditId(null);
      setForm({ name: '', slug: '', parentId: '', sortOrder: 0 });
      fetchCategories();
    } catch (e) { alert('저장 실패'); }
  }

  function startEdit(cat) {
    setEditId(cat.id);
    setForm({ name: cat.name, slug: cat.slug, parentId: cat.parentId || '', sortOrder: cat.sortOrder });
    setShowForm(true);
  }

  async function toggleActive(id) {
    await apiPatch(`/api/admin/categories/${id}/toggle-active`);
    fetchCategories();
  }

  const tree = buildTree();
  const parents = categories.filter(c => !c.parentId);

  return (
    <AdminGuard>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.6rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 style={{ marginBottom: 0 }}>카테고리 관리</h1>
        <button className="admin-btn admin-btn-primary" onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ name: '', slug: '', parentId: '', sortOrder: 0 }); }}>
          {showForm ? '취소' : '카테고리 추가'}
        </button>
      </div>

      {showForm && (
        <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
          <h3>{editId ? '카테고리 수정' : '새 카테고리'}</h3>
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-row">
              <div className="form-group">
                <label>이름</label>
                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>슬러그</label>
                <input type="text" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>상위 카테고리</label>
                <select value={form.parentId} onChange={e => setForm({ ...form, parentId: e.target.value })}>
                  <option value="">없음 (최상위)</option>
                  {parents.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>정렬순서</label>
                <input type="number" value={form.sortOrder} onChange={e => setForm({ ...form, sortOrder: e.target.value })} />
              </div>
            </div>
            <button type="submit" className="admin-btn admin-btn-primary">{editId ? '수정' : '추가'}</button>
          </form>
        </div>
      )}

      {tree.map(parent => {
        const isOpen = openParents[parent.id] !== false;
        const childCount = parent.children?.length || 0;

        return (
          <div key={parent.id} className="admin-card" style={{ marginBottom: '1rem' }}>
            <div
              onClick={() => childCount > 0 && toggleParent(parent.id)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                cursor: childCount > 0 ? 'pointer' : 'default', userSelect: 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                {childCount > 0 && (
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: '2.4rem', height: '2.4rem', borderRadius: '6px',
                    background: 'var(--admin-primary-soft)', color: 'var(--admin-primary)',
                    fontSize: '1.2rem', transition: 'transform 0.2s ease',
                    transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                  }}>
                    &#9654;
                  </span>
                )}
                <div>
                  <strong style={{ fontSize: '1.5rem' }}>{parent.name}</strong>
                  <span style={{ marginLeft: '0.8rem', fontSize: '1.2rem', color: 'var(--admin-text-muted)', fontFamily: 'monospace' }}>{parent.slug}</span>
                  {childCount > 0 && (
                    <span style={{ marginLeft: '0.6rem', fontSize: '1.2rem', color: 'var(--admin-text-muted)' }}>
                      ({childCount})
                    </span>
                  )}
                </div>
                <span className={`admin-badge ${parent.isActive ? 'admin-badge-active' : 'admin-badge-inactive'}`} style={{ marginLeft: '0.8rem' }}>
                  {parent.isActive ? '활성' : '비활성'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }} onClick={e => e.stopPropagation()}>
                <span style={{ fontSize: '1.2rem', color: 'var(--admin-text-muted)', marginRight: '0.5rem', alignSelf: 'center' }}>순서: {parent.sortOrder}</span>
                <button onClick={() => startEdit(parent)} className="admin-btn admin-btn-sm">수정</button>
                <button onClick={() => toggleActive(parent.id)} className={`admin-btn admin-btn-sm ${parent.isActive ? 'admin-btn-danger' : 'admin-btn-success'}`}>
                  {parent.isActive ? '비활성화' : '활성화'}
                </button>
              </div>
            </div>

            {isOpen && childCount > 0 && (
              <table className="admin-table" style={{ marginTop: '1.2rem' }}>
                <thead>
                  <tr>
                    <th>이름</th>
                    <th>슬러그</th>
                    <th>정렬</th>
                    <th>상태</th>
                    <th>관리</th>
                  </tr>
                </thead>
                <tbody>
                  {parent.children.map(child => (
                    <tr key={child.id} style={!child.isActive ? { opacity: 0.5 } : {}}>
                      <td>{child.name}</td>
                      <td style={{ fontFamily: 'monospace', fontSize: '1.2rem', color: 'var(--admin-text-muted)' }}>{child.slug}</td>
                      <td>{child.sortOrder}</td>
                      <td>
                        <span className={`admin-badge ${child.isActive ? 'admin-badge-active' : 'admin-badge-inactive'}`}>
                          {child.isActive ? '활성' : '비활성'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button onClick={() => startEdit(child)} className="admin-btn admin-btn-sm">수정</button>
                          <button onClick={() => toggleActive(child.id)} className={`admin-btn admin-btn-sm ${child.isActive ? 'admin-btn-danger' : 'admin-btn-success'}`}>
                            {child.isActive ? '비활성화' : '활성화'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        );
      })}
    </AdminGuard>
  );
}
