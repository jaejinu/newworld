'use client';
import { useState, useEffect, useRef } from 'react';
import AdminGuard from '@/components/admin/common/AdminGuard';
import { apiGet, apiUpload, apiDelete } from '@/lib/api/client';

export default function MediaPage() {
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const perPage = 20;

  useEffect(() => { fetchImages(); }, [page]);

  async function fetchImages() {
    try {
      const data = await apiGet(`/api/admin/upload/images?page=${page}&perPage=${perPage}`);
      setImages(data.items || []);
      setTotalPages(data.totalPages || 1);
    } catch (e) { console.error(e); }
  }

  async function handleUpload(e) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        await apiUpload('/api/admin/upload/image', formData);
      }
      fetchImages();
    } catch (err) {
      alert('업로드 실패');
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function handleDelete(id) {
    if (!confirm('이미지를 삭제하시겠습니까?')) return;
    try {
      await apiDelete(`/api/admin/upload/images/${id}`);
      fetchImages();
    } catch (e) {
      alert('삭제 실패');
    }
  }

  function formatSize(bytes) {
    if (!bytes) return '-';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  function formatDate(dateStr) {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' });
  }

  return (
    <AdminGuard>
      <div className="admin-page-header">
        <h1>미디어 라이브러리</h1>
        <label className="admin-btn admin-btn-primary" style={{ cursor: 'pointer' }}>
          {uploading ? '업로드 중...' : '이미지 업로드'}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleUpload}
            style={{ display: 'none' }}
            disabled={uploading}
          />
        </label>
      </div>

      <div className="admin-card">
        {images.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>업로드된 이미지가 없습니다.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
            {images.map(image => (
              <div key={image.id} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden', background: '#fff' }}>
                <div style={{ width: '100%', height: '150px', overflow: 'hidden', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img
                    src={image.url || image.path}
                    alt={image.filename || image.originalName}
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ padding: '0.75rem' }}>
                  <p style={{ fontSize: '1.3rem', fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '0.25rem' }}>
                    {image.filename || image.originalName}
                  </p>
                  <p style={{ fontSize: '1.2rem', color: '#888', marginBottom: '0.5rem' }}>
                    {formatSize(image.size)} | {formatDate(image.createdAt)}
                  </p>
                  <button
                    onClick={() => handleDelete(image.id)}
                    className="admin-btn admin-btn-sm admin-btn-danger"
                    style={{ width: '100%' }}
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="admin-pagination" style={{ marginTop: '1.5rem' }}>
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
