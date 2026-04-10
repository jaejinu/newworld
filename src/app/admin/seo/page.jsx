'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminGuard from '@/components/admin/common/AdminGuard';
import { apiGet } from '@/lib/api/client';

export default function SeoDashboardPage() {
  const router = useRouter();
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => { fetchDashboard(); }, []);

  async function fetchDashboard() {
    try {
      const data = await apiGet('/api/admin/seo/dashboard');
      setDashboard(data);
    } catch (e) { console.error(e); }
  }

  function getScoreColor(score) {
    if (score >= 80) return 'var(--admin-success)';
    if (score >= 50) return 'var(--admin-warning)';
    return 'var(--admin-danger)';
  }

  function getScoreClass(score) {
    if (score >= 80) return 'score-high';
    if (score >= 50) return 'score-mid';
    return 'score-low';
  }

  if (!dashboard) {
    return (
      <AdminGuard>
        <div className="admin-page-header"><h1>SEO / AEO / GEO</h1></div>
        <div className="admin-card"><p>로딩 중...</p></div>
      </AdminGuard>
    );
  }

  const { averages, posts } = dashboard;

  return (
    <AdminGuard>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.6rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 style={{ marginBottom: 0 }}>SEO / AEO / GEO</h1>
        <Link href="/admin/seo/pages" className="admin-btn admin-btn-primary">
          페이지 SEO 관리 →
        </Link>
      </div>

      <div className="admin-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="admin-card stat-card">
          <h3>SEO 평균</h3>
          <div className="stat-number" style={{ color: getScoreColor(averages?.seo || 0) }}>
            {Math.round(averages?.seo || 0)}
          </div>
        </div>
        <div className="admin-card stat-card">
          <h3>AEO 평균</h3>
          <div className="stat-number" style={{ color: getScoreColor(averages?.aeo || 0) }}>
            {Math.round(averages?.aeo || 0)}
          </div>
        </div>
        <div className="admin-card stat-card">
          <h3>GEO 평균</h3>
          <div className="stat-number" style={{ color: getScoreColor(averages?.geo || 0) }}>
            {Math.round(averages?.geo || 0)}
          </div>
        </div>
      </div>

      <div className="admin-card">
        <h2>게시글별 점수 (낮은 순)</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>제목</th>
              <th>SEO</th>
              <th>AEO</th>
              <th>GEO</th>
              <th>총점</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {(posts || []).map(post => {
              const total = (post.seoScore || 0) + (post.aeoScore || 0) + (post.geoScore || 0);
              return (
                <tr key={post.id}>
                  <td>{post.title}</td>
                  <td><span className={`admin-score ${getScoreClass(post.seoScore || 0)}`}>{post.seoScore || 0}</span></td>
                  <td><span className={`admin-score ${getScoreClass(post.aeoScore || 0)}`}>{post.aeoScore || 0}</span></td>
                  <td><span className={`admin-score ${getScoreClass(post.geoScore || 0)}`}>{post.geoScore || 0}</span></td>
                  <td><strong>{total}</strong></td>
                  <td>
                    <button
                      onClick={() => router.push(`/admin/seo/post/${post.id}`)}
                      className="admin-btn admin-btn-sm admin-btn-primary"
                    >
                      편집
                    </button>
                  </td>
                </tr>
              );
            })}
            {(!posts || posts.length === 0) && (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '3rem' }}>데이터가 없습니다.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminGuard>
  );
}
