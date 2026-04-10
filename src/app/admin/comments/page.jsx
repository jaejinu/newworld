'use client';
import { useState, useEffect } from 'react';
import AdminGuard from '@/components/admin/common/AdminGuard';
import { apiGet, apiPatch } from '@/lib/api/client';

export default function CommentsPage() {
  const [comments, setComments] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const perPage = 20;

  useEffect(() => { fetchComments(); }, [page]);

  async function fetchComments() {
    try {
      const data = await apiGet(`/api/admin/comments?page=${page}&perPage=${perPage}`);
      setComments(data.items || []);
      setTotalPages(data.totalPages || 1);
    } catch (e) { console.error(e); }
  }

  async function toggleActive(id) {
    try {
      await apiPatch(`/api/admin/comments/${id}/toggle-active`);
      fetchComments();
    } catch (e) { alert('상태 변경 실패'); }
  }

  function truncate(str, len) {
    if (!str) return '';
    return str.length > len ? str.slice(0, len) + '...' : str;
  }

  function formatDate(dateStr) {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' });
  }

  return (
    <AdminGuard>
      <div className="admin-page-header">
        <h1>댓글 관리</h1>
      </div>

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>게시글 제목</th>
              <th>작성자</th>
              <th>내용</th>
              <th>상태</th>
              <th>작성일</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {comments.map(comment => (
              <tr key={comment.id} className={!comment.isActive ? 'row-inactive' : ''}>
                <td>{comment.id}</td>
                <td>{truncate(comment.postTitle || comment.post?.title, 30)}</td>
                <td>{comment.authorName || comment.author?.name || '-'}</td>
                <td title={comment.content}>{truncate(comment.content, 50)}</td>
                <td>
                  <span className={`admin-badge ${comment.isActive ? 'admin-badge-active' : 'admin-badge-inactive'}`}>
                    {comment.isActive ? '활성' : '비활성'}
                  </span>
                </td>
                <td>{formatDate(comment.createdAt)}</td>
                <td>
                  <button
                    onClick={() => toggleActive(comment.id)}
                    className={`admin-btn admin-btn-sm ${comment.isActive ? 'admin-btn-danger' : 'admin-btn-success'}`}
                  >
                    {comment.isActive ? '비활성화' : '활성화'}
                  </button>
                </td>
              </tr>
            ))}
            {comments.length === 0 && (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>댓글이 없습니다.</td></tr>
            )}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="admin-pagination">
            <button
              className="admin-btn admin-btn-sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              이전
            </button>
            <span className="pagination-info">{page} / {totalPages}</span>
            <button
              className="admin-btn admin-btn-sm"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              다음
            </button>
          </div>
        )}
      </div>
    </AdminGuard>
  );
}
