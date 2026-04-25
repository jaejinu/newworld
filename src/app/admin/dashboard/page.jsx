'use client';
import { useState, useEffect } from 'react';
import AdminGuard from '@/components/admin/common/AdminGuard';
import { apiGet } from '@/lib/api/client';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [seoData, setSeoData] = useState(null);

  useEffect(() => {
    Promise.all([
      apiGet('/api/admin/posts?perPage=1').catch(() => null),
      apiGet('/api/admin/seo/dashboard').catch(() => null),
    ]).then(([postData, seo]) => {
      setStats(postData?.meta || {});
      setSeoData(seo);
    });
  }, []);

  return (
    <AdminGuard>
      <h1>대시보드</h1>
      <div className="admin-grid">
        <div className="admin-card stat-card">
          <h3>전체 게시글</h3>
          <div className="stat-number">{stats?.total || 0}</div>
        </div>
        <div className="admin-card stat-card">
          <h3>SEO 평균</h3>
          <div className={`stat-number admin-score ${getScoreClass(seoData?.averages?.seo)}`}>
            {Math.round(seoData?.averages?.seo || 0)}
          </div>
        </div>
        <div className="admin-card stat-card">
          <h3>AEO 평균</h3>
          <div className={`stat-number admin-score ${getScoreClass(seoData?.averages?.aeo)}`}>
            {Math.round(seoData?.averages?.aeo || 0)}
          </div>
        </div>
        <div className="admin-card stat-card">
          <h3>GEO 평균</h3>
          <div className={`stat-number admin-score ${getScoreClass(seoData?.averages?.geo)}`}>
            {Math.round(seoData?.averages?.geo || 0)}
          </div>
        </div>
      </div>

      {seoData?.posts?.length > 0 && (
        <div className="admin-card" style={{ marginTop: '2rem' }}>
          <h2>SEO 개선 필요 게시글</h2>
          <table className="admin-table">
            <thead>
              <tr>
                <th>제목</th>
                <th>SEO</th>
                <th>AEO</th>
                <th>GEO</th>
                <th>총점</th>
              </tr>
            </thead>
            <tbody>
              {seoData.posts.slice(0, 10).map(post => (
                <tr key={post.id}>
                  <td>{post.title}</td>
                  <td><span className={`admin-score ${getScoreClass(post.seoScore)}`}>{post.seoScore || 0}</span></td>
                  <td><span className={`admin-score ${getScoreClass(post.aeoScore)}`}>{post.aeoScore || 0}</span></td>
                  <td><span className={`admin-score ${getScoreClass(post.geoScore)}`}>{post.geoScore || 0}</span></td>
                  <td><span className={`admin-score ${getScoreClass(Math.round(((post.seoScore||0)+(post.aeoScore||0)+(post.geoScore||0))/3))}`}>{Math.round(((post.seoScore||0)+(post.aeoScore||0)+(post.geoScore||0))/3)}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminGuard>
  );
}

function getScoreClass(score) {
  if (!score) return 'score-low';
  if (score >= 70) return 'score-high';
  if (score >= 40) return 'score-mid';
  return 'score-low';
}
