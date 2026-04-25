'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import AdminGuard from '@/components/admin/common/AdminGuard';
import { apiGet, apiPatch } from '@/lib/api/client';

export default function PostsListPage() {
  const [posts, setPosts] = useState([]);
  const [meta, setMeta] = useState({});
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [categorySlug, setCategorySlug] = useState('');
  const [isActive, setIsActive] = useState('');
  const [itemType, setItemType] = useState('');
  const [categories, setCategories] = useState([]);
  const debounceRef = useRef(null);

  useEffect(() => {
    apiGet('/api/admin/categories').then(data => setCategories(data || []));
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [search]);

  useEffect(() => {
    fetchPosts();
  }, [page, debouncedSearch, categorySlug, isActive, itemType]);

  async function fetchPosts() {
    const params = new URLSearchParams({ page, perPage: 15 });
    if (debouncedSearch) params.set('search', debouncedSearch);
    if (categorySlug) params.set('categorySlug', categorySlug);
    if (isActive !== '') params.set('isActive', isActive);
    if (itemType) params.set('itemType', itemType);

    try {
      const result = await apiGet(`/api/admin/posts?${params}`);
      setPosts(result.data || []);
      setMeta(result.meta || {});
    } catch (e) { console.error(e); }
  }

  async function toggleActive(id) {
    await apiPatch(`/api/admin/posts/${id}/toggle-active`);
    fetchPosts();
  }

  function formatDate(d) {
    if (!d) return '-';
    return new Date(d).toLocaleDateString('ko-KR');
  }

  // Flatten categories for dropdown (parent > child)
  function flatCategories() {
    const flat = [];
    categories.forEach(cat => {
      flat.push(cat);
      if (cat.children) {
        cat.children.forEach(child => flat.push({ ...child, name: `ㄴ ${child.name}` }));
      }
    });
    return flat;
  }

  return (
    <AdminGuard>
      <div className="admin-page-header">
        <h1>게시글 관리</h1>
        <Link href="/admin/posts/new" className="admin-btn admin-btn-primary">새 게시글</Link>
      </div>

      <div className="admin-card">
        <div className="admin-filters">
          <input type="text" placeholder="제목 검색..." value={search} onChange={e => setSearch(e.target.value)} style={{ padding: '0.6rem 1rem', border: '1px solid var(--admin-border)', borderRadius: '8px', fontSize: '1.34rem', outline: 'none', minWidth: '200px' }} />
          <select value={categorySlug} onChange={e => { setCategorySlug(e.target.value); setPage(1); }}>
            <option value="">전체 카테고리</option>
            {flatCategories().map(c => <option key={c.id} value={c.slug}>{c.name}</option>)}
          </select>
          <select value={isActive} onChange={e => { setIsActive(e.target.value); setPage(1); }}>
            <option value="">전체 상태</option>
            <option value="true">활성</option>
            <option value="false">비활성</option>
          </select>
          <select value={itemType} onChange={e => { setItemType(e.target.value); setPage(1); }}>
            <option value="">전체 유형</option>
            <option value="recommended">추천</option>
            <option value="noticePost">공지</option>
            <option value="editorPick">에디터픽</option>
          </select>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>제목</th>
              <th>카테고리</th>
              <th>상태</th>
              <th>플래그</th>
              <th>조회수</th>
              <th>작성일</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {posts.map(post => (
              <tr key={post.id} className={!post.isActive ? 'row-inactive' : ''}>
                <td>{post.id}</td>
                <td><Link href={`/admin/posts/${post.id}`}>{post.title}</Link></td>
                <td>{post.category?.name || '-'}</td>
                <td>
                  <span className={`admin-badge ${post.isActive ? 'admin-badge-active' : 'admin-badge-inactive'}`}>
                    {post.isActive ? '활성' : '비활성'}
                  </span>
                </td>
                <td>
                  {post.recommended && <span className="admin-badge admin-badge-info">추천</span>}
                  {post.noticePost && <span className="admin-badge admin-badge-warning">공지</span>}
                  {post.editorPick && <span className="admin-badge admin-badge-primary">에디터픽</span>}
                </td>
                <td>{post.viewCount}</td>
                <td>{formatDate(post.publishedAt)}</td>
                <td>
                  <Link href={`/admin/posts/${post.id}`} className="admin-btn admin-btn-sm">수정</Link>
                  <button onClick={() => toggleActive(post.id)} className={`admin-btn admin-btn-sm ${post.isActive ? 'admin-btn-danger' : 'admin-btn-success'}`}>
                    {post.isActive ? '비활성화' : '활성화'}
                  </button>
                </td>
              </tr>
            ))}
            {posts.length === 0 && <tr><td colSpan="8" style={{textAlign:'center'}}>게시글이 없습니다.</td></tr>}
          </tbody>
        </table>

        {meta.totalPages > 1 && (
          <div className="admin-pagination">
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>이전</button>
            <span>{page} / {meta.totalPages}</span>
            <button disabled={page >= meta.totalPages} onClick={() => setPage(p => p + 1)}>다음</button>
          </div>
        )}
      </div>
    </AdminGuard>
  );
}
