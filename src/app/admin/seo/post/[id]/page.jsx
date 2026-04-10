'use client';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import AdminGuard from '@/components/admin/common/AdminGuard';
import { apiGet, apiPost, apiPatch } from '@/lib/api/client';

export default function SeoPostPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const [post, setPost] = useState(null);
  const [activeTab, setActiveTab] = useState('seo');
  const [scoreResult, setScoreResult] = useState(null);
  const [saving, setSaving] = useState(false);

  const [seo, setSeo] = useState({
    focusKeyword: '',
    metaTitle: '',
    metaDescription: '',
    canonicalUrl: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    ogType: 'article',
    twitterCard: 'summary_large_image',
    robotsMeta: '',
  });

  const [aeo, setAeo] = useState({
    jsonLdType: 'Article',
    faqItems: [],
    howToSteps: [],
    tldrSummary: '',
    lastReviewedAt: '',
    jsonLdData: '',
  });

  const [geo, setGeo] = useState({
    businessName: '',
    address: '',
    phone: '',
    openingHours: '',
    latitude: '',
    longitude: '',
    serviceArea: '',
    localKeywords: '',
    mapUrl: '',
    departmentServices: '',
    appointmentUrl: '',
    emergencyContact: '',
  });

  useEffect(() => { fetchData(); }, [id]);

  async function fetchData() {
    try {
      const postData = await apiGet(`/api/admin/posts/${id}`);
      setPost(postData);
    } catch (e) { console.error(e); }

    try {
      const seoData = await apiGet(`/api/admin/seo/post/${id}`);
      if (seoData) {
        if (seoData.seo) setSeo(prev => ({ ...prev, ...seoData.seo }));
        if (seoData.aeo) {
          setAeo(prev => ({
            ...prev,
            ...seoData.aeo,
            faqItems: seoData.aeo.faqItems || [],
            howToSteps: seoData.aeo.howToSteps || [],
          }));
        }
        if (seoData.geo) setGeo(prev => ({ ...prev, ...seoData.geo }));
      }
    } catch (e) {
      // 404 is ok - no meta yet
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      await apiPatch(`/api/admin/seo/post/${id}`, { seo, aeo, geo });
      alert('저장되었습니다.');
    } catch (e) {
      alert('저장 실패');
    }
    setSaving(false);
  }

  async function checkScore() {
    try {
      const result = await apiGet(`/api/admin/seo/post/${id}/score`);
      setScoreResult(result);
    } catch (e) {
      alert('점수 확인 실패');
    }
  }

  async function handleOgImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const result = await apiPost('/api/admin/upload/image', formData);
      setSeo(prev => ({ ...prev, ogImage: result.url }));
    } catch (err) {
      alert('이미지 업로드 실패');
    }
  }

  // FAQ helpers
  function addFaqItem() {
    setAeo(prev => ({ ...prev, faqItems: [...prev.faqItems, { question: '', answer: '' }] }));
  }
  function removeFaqItem(idx) {
    setAeo(prev => ({ ...prev, faqItems: prev.faqItems.filter((_, i) => i !== idx) }));
  }
  function updateFaqItem(idx, field, value) {
    setAeo(prev => ({
      ...prev,
      faqItems: prev.faqItems.map((item, i) => i === idx ? { ...item, [field]: value } : item),
    }));
  }

  // HowTo helpers
  function addHowToStep() {
    setAeo(prev => ({ ...prev, howToSteps: [...prev.howToSteps, { name: '', text: '' }] }));
  }
  function removeHowToStep(idx) {
    setAeo(prev => ({ ...prev, howToSteps: prev.howToSteps.filter((_, i) => i !== idx) }));
  }
  function updateHowToStep(idx, field, value) {
    setAeo(prev => ({
      ...prev,
      howToSteps: prev.howToSteps.map((item, i) => i === idx ? { ...item, [field]: value } : item),
    }));
  }

  const tabs = [
    { key: 'seo', label: 'SEO' },
    { key: 'aeo', label: 'AEO' },
    { key: 'geo', label: 'GEO' },
  ];

  return (
    <AdminGuard>
      <div className="admin-page-header">
        <h1>SEO 편집 {post ? `- ${post.title}` : ''}</h1>
        <button className="admin-btn" onClick={() => router.push('/admin/seo')}>목록으로</button>
      </div>

      {post && (
        <div className="admin-card" style={{ marginBottom: '1rem' }}>
          <p><strong>슬러그:</strong> {post.slug}</p>
        </div>
      )}

      <div className="admin-tabs" style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {tabs.map(tab => (
          <button
            key={tab.key}
            className={`admin-btn ${activeTab === tab.key ? 'admin-btn-primary' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="admin-card">
        {activeTab === 'seo' && (
          <div className="admin-form">
            <div className="form-group">
              <label>Focus Keyword</label>
              <input value={seo.focusKeyword} onChange={e => setSeo({ ...seo, focusKeyword: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Meta Title <span style={{ color: '#888' }}>({seo.metaTitle.length}/60)</span></label>
              <input value={seo.metaTitle} onChange={e => setSeo({ ...seo, metaTitle: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Meta Description <span style={{ color: '#888' }}>({seo.metaDescription.length}/160)</span></label>
              <textarea rows={3} value={seo.metaDescription} onChange={e => setSeo({ ...seo, metaDescription: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Canonical URL</label>
              <input value={seo.canonicalUrl} onChange={e => setSeo({ ...seo, canonicalUrl: e.target.value })} />
            </div>
            <div className="form-group">
              <label>OG Title</label>
              <input value={seo.ogTitle} onChange={e => setSeo({ ...seo, ogTitle: e.target.value })} />
            </div>
            <div className="form-group">
              <label>OG Description</label>
              <textarea rows={2} value={seo.ogDescription} onChange={e => setSeo({ ...seo, ogDescription: e.target.value })} />
            </div>
            <div className="form-group">
              <label>OG Image</label>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input value={seo.ogImage} onChange={e => setSeo({ ...seo, ogImage: e.target.value })} style={{ flex: 1 }} />
                <label className="admin-btn admin-btn-sm" style={{ cursor: 'pointer' }}>
                  업로드
                  <input type="file" accept="image/*" onChange={handleOgImageUpload} style={{ display: 'none' }} />
                </label>
              </div>
              {seo.ogImage && <img src={seo.ogImage} alt="OG" style={{ maxWidth: '200px', marginTop: '0.5rem', borderRadius: '4px' }} />}
            </div>
            <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label>OG Type</label>
                <select value={seo.ogType} onChange={e => setSeo({ ...seo, ogType: e.target.value })}>
                  <option value="article">article</option>
                  <option value="website">website</option>
                  <option value="profile">profile</option>
                </select>
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Twitter Card</label>
                <select value={seo.twitterCard} onChange={e => setSeo({ ...seo, twitterCard: e.target.value })}>
                  <option value="summary">summary</option>
                  <option value="summary_large_image">summary_large_image</option>
                  <option value="player">player</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Robots Meta</label>
              <input value={seo.robotsMeta} onChange={e => setSeo({ ...seo, robotsMeta: e.target.value })} placeholder="index, follow" />
            </div>
          </div>
        )}

        {activeTab === 'aeo' && (
          <div className="admin-form">
            <div className="form-group">
              <label>JSON-LD Type</label>
              <select value={aeo.jsonLdType} onChange={e => setAeo({ ...aeo, jsonLdType: e.target.value })}>
                <option value="Article">Article</option>
                <option value="FAQPage">FAQPage</option>
                <option value="HowTo">HowTo</option>
                <option value="LocalBusiness">LocalBusiness</option>
              </select>
            </div>

            <div className="form-group">
              <label>FAQ Items</label>
              {aeo.faqItems.map((item, idx) => (
                <div key={idx} style={{ border: '1px solid #ddd', borderRadius: '4px', padding: '0.75rem', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <strong>FAQ #{idx + 1}</strong>
                    <button type="button" className="admin-btn admin-btn-sm admin-btn-danger" onClick={() => removeFaqItem(idx)}>삭제</button>
                  </div>
                  <textarea placeholder="질문" rows={2} value={item.question} onChange={e => updateFaqItem(idx, 'question', e.target.value)} style={{ width: '100%', marginBottom: '0.5rem' }} />
                  <textarea placeholder="답변" rows={3} value={item.answer} onChange={e => updateFaqItem(idx, 'answer', e.target.value)} style={{ width: '100%' }} />
                </div>
              ))}
              <button type="button" className="admin-btn admin-btn-sm" onClick={addFaqItem}>+ FAQ 추가</button>
            </div>

            <div className="form-group">
              <label>HowTo Steps</label>
              {aeo.howToSteps.map((step, idx) => (
                <div key={idx} style={{ border: '1px solid #ddd', borderRadius: '4px', padding: '0.75rem', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <strong>Step #{idx + 1}</strong>
                    <button type="button" className="admin-btn admin-btn-sm admin-btn-danger" onClick={() => removeHowToStep(idx)}>삭제</button>
                  </div>
                  <input placeholder="단계 이름" value={step.name} onChange={e => updateHowToStep(idx, 'name', e.target.value)} style={{ width: '100%', marginBottom: '0.5rem' }} />
                  <textarea placeholder="단계 설명" rows={2} value={step.text} onChange={e => updateHowToStep(idx, 'text', e.target.value)} style={{ width: '100%' }} />
                </div>
              ))}
              <button type="button" className="admin-btn admin-btn-sm" onClick={addHowToStep}>+ Step 추가</button>
            </div>

            <div className="form-group">
              <label>TL;DR Summary</label>
              <textarea rows={3} value={aeo.tldrSummary} onChange={e => setAeo({ ...aeo, tldrSummary: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Last Reviewed At</label>
              <input type="date" value={aeo.lastReviewedAt ? aeo.lastReviewedAt.slice(0, 10) : ''} onChange={e => setAeo({ ...aeo, lastReviewedAt: e.target.value })} />
            </div>
            <div className="form-group">
              <label>JSON-LD Data (수동 오버라이드)</label>
              <textarea rows={6} value={aeo.jsonLdData} onChange={e => setAeo({ ...aeo, jsonLdData: e.target.value })} style={{ fontFamily: 'monospace' }} />
            </div>
          </div>
        )}

        {activeTab === 'geo' && (
          <div className="admin-form">
            <div className="form-group">
              <label>Business Name</label>
              <input value={geo.businessName} onChange={e => setGeo({ ...geo, businessName: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Address</label>
              <input value={geo.address} onChange={e => setGeo({ ...geo, address: e.target.value })} />
            </div>
            <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Phone</label>
                <input value={geo.phone} onChange={e => setGeo({ ...geo, phone: e.target.value })} />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Opening Hours</label>
                <input value={geo.openingHours} onChange={e => setGeo({ ...geo, openingHours: e.target.value })} />
              </div>
            </div>
            <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Latitude</label>
                <input value={geo.latitude} onChange={e => setGeo({ ...geo, latitude: e.target.value })} />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Longitude</label>
                <input value={geo.longitude} onChange={e => setGeo({ ...geo, longitude: e.target.value })} />
              </div>
            </div>
            <div className="form-group">
              <label>Service Area</label>
              <input value={geo.serviceArea} onChange={e => setGeo({ ...geo, serviceArea: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Local Keywords (쉼표 구분)</label>
              <input value={geo.localKeywords} onChange={e => setGeo({ ...geo, localKeywords: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Map URL</label>
              <input value={geo.mapUrl} onChange={e => setGeo({ ...geo, mapUrl: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Department / Services</label>
              <textarea rows={3} value={geo.departmentServices} onChange={e => setGeo({ ...geo, departmentServices: e.target.value })} />
            </div>
            <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Appointment URL</label>
                <input value={geo.appointmentUrl} onChange={e => setGeo({ ...geo, appointmentUrl: e.target.value })} />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Emergency Contact</label>
                <input value={geo.emergencyContact} onChange={e => setGeo({ ...geo, emergencyContact: e.target.value })} />
              </div>
            </div>
          </div>
        )}
      </div>

      <div style={{ marginTop: '2rem', display: 'flex', gap: '0.8rem' }}>
        <button className="admin-btn admin-btn-primary admin-btn-lg" onClick={handleSave} disabled={saving}>
          {saving ? '저장 중...' : '저장'}
        </button>
        <button className="admin-btn admin-btn-lg" onClick={checkScore}>점수 확인</button>
      </div>

      {scoreResult && (
        <div className="admin-card" style={{ marginTop: '1.5rem' }}>
          <h3>점수 결과</h3>
          <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1rem' }}>
            <div><strong>SEO:</strong> {scoreResult.seoScore || 0}</div>
            <div><strong>AEO:</strong> {scoreResult.aeoScore || 0}</div>
            <div><strong>GEO:</strong> {scoreResult.geoScore || 0}</div>
            <div><strong>총점:</strong> {(scoreResult.seoScore || 0) + (scoreResult.aeoScore || 0) + (scoreResult.geoScore || 0)}</div>
          </div>
          {scoreResult.checks && (
            <table className="admin-table">
              <thead>
                <tr><th>항목</th><th>결과</th><th>점수</th><th>조언</th></tr>
              </thead>
              <tbody>
                {scoreResult.checks.map((check, idx) => (
                  <tr key={idx}>
                    <td>{check.name}</td>
                    <td style={{ color: check.passed ? '#22c55e' : '#ef4444', fontWeight: 'bold' }}>
                      {check.passed ? '\u2713' : '\u2717'}
                    </td>
                    <td>{check.points}</td>
                    <td style={{ color: 'var(--admin-text-muted)', fontSize: '1.3rem' }}>{!check.passed ? check.advice : ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </AdminGuard>
  );
}
