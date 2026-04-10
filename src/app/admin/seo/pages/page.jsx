'use client';
import { useState, useEffect } from 'react';
import AdminGuard from '@/components/admin/common/AdminGuard';
import { apiGet, apiPut, apiPost } from '@/lib/api/client';

const PAGE_GROUPS = [
  {
    group: '메인',
    pages: [
      { id: 'home', label: '홈 (메인페이지)', path: '/' },
      { id: 'search', label: '검색 페이지', path: '/search' },
    ],
  },
  {
    group: '눈 이야기',
    pages: [
      { id: 'eye-story', label: '눈 이야기 (전체)', path: '/eye-story' },
      { id: 'deep-eye-stories', label: 'ㄴ 눈 속 가장 깊은 이야기', path: '/eye-story/deep-eye-stories' },
      { id: 'silent-vision-thief', label: 'ㄴ 조용히 시야를 훔치는 병', path: '/eye-story/silent-vision-thief' },
      { id: 'restore-clarity', label: 'ㄴ 흐려진 세상을 다시 선명하게', path: '/eye-story/restore-clarity' },
      { id: 'glasses-free-tech', label: 'ㄴ 안경 벗는 순간의 기술', path: '/eye-story/glasses-free-tech' },
      { id: 'distant-world-close-view', label: 'ㄴ 멀어지는 세상, 가까이 보기', path: '/eye-story/distant-world-close-view' },
      { id: 'eye-health-report', label: 'ㄴ 눈 건강 리포트', path: '/eye-story/eye-health-report' },
    ],
  },
  {
    group: '스토리',
    pages: [
      { id: 'medical-team-stories', label: '의료진 스토리', path: '/medical-team-stories' },
      { id: 'member-stories', label: '멤버 스토리', path: '/member-stories' },
      { id: 'patient-stories', label: '환자 스토리', path: '/patient-stories' },
    ],
  },
  {
    group: '소식',
    pages: [
      { id: 'center-news', label: '센터 소식', path: '/center-news' },
    ],
  },
];

const ALL_PAGES = PAGE_GROUPS.flatMap(g => g.pages);

const DEFAULT_SEO = {
  focusKeyword: '', metaTitle: '', metaDescription: '', canonicalUrl: '',
  ogTitle: '', ogDescription: '', ogImage: '', ogType: 'website',
  twitterCard: 'summary_large_image', robotsMeta: 'index, follow',
};
const DEFAULT_AEO = {
  jsonLdType: 'Article', faqItems: [], howToSteps: [],
  tldrSummary: '', lastReviewedAt: '', jsonLdData: '',
};
const DEFAULT_GEO = {
  businessName: '', address: '', phone: '', openingHours: '',
  latitude: '', longitude: '', serviceArea: '', localKeywords: '',
  mapUrl: '', departmentServices: '', appointmentUrl: '', emergencyContact: '',
};

export default function SeoStaticPagesPage() {
  const [pagesData, setPagesData] = useState({});
  const [openGroups, setOpenGroups] = useState(() => PAGE_GROUPS.reduce((acc, g) => ({ ...acc, [g.group]: true }), {}));
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState('seo');
  const [seo, setSeo] = useState({ ...DEFAULT_SEO });
  const [aeo, setAeo] = useState({ ...DEFAULT_AEO });
  const [geo, setGeo] = useState({ ...DEFAULT_GEO });
  const [saving, setSaving] = useState(false);
  const [scoreResult, setScoreResult] = useState(null);

  useEffect(() => { fetchAll(); }, []);

  async function fetchAll() {
    const result = {};
    for (const page of ALL_PAGES) {
      try {
        const data = await apiGet(`/api/admin/seo/page/${page.id}`);
        result[page.id] = data;
      } catch {
        result[page.id] = null;
      }
    }
    setPagesData(result);
  }

  function startEdit(identifier) {
    const data = pagesData[identifier];
    setEditingId(identifier);
    setActiveTab('seo');
    setScoreResult(null);

    setSeo({
      ...DEFAULT_SEO,
      ...(data?.seo || {}),
      focusKeyword: data?.seo?.focusKeyword || data?.focusKeyword || '',
      metaTitle: data?.seo?.metaTitle || data?.metaTitle || '',
      metaDescription: data?.seo?.metaDescription || data?.metaDescription || '',
      canonicalUrl: data?.seo?.canonicalUrl || data?.canonicalUrl || '',
      ogTitle: data?.seo?.ogTitle || data?.ogTitle || '',
      ogDescription: data?.seo?.ogDescription || data?.ogDescription || '',
      ogImage: data?.seo?.ogImage || data?.ogImage || '',
      ogType: data?.seo?.ogType || data?.ogType || 'website',
      twitterCard: data?.seo?.twitterCard || data?.twitterCard || 'summary_large_image',
      robotsMeta: data?.seo?.robotsMeta || data?.robotsMeta || 'index, follow',
    });

    setAeo({
      ...DEFAULT_AEO,
      ...(data?.aeo || {}),
      faqItems: data?.aeo?.faqItems || [],
      howToSteps: data?.aeo?.howToSteps || [],
    });

    setGeo({
      ...DEFAULT_GEO,
      ...(data?.geo || {}),
    });
  }

  async function handleSave() {
    if (!editingId) return;
    setSaving(true);
    try {
      const payload = { ...seo, ...aeo, ...geo, faqItems: JSON.stringify(aeo.faqItems), howToSteps: JSON.stringify(aeo.howToSteps), localBusinessData: JSON.stringify(geo) };
      await apiPut(`/api/admin/seo/page/${editingId}`, payload);
      await fetchAll();
      alert('저장되었습니다.');
    } catch {
      alert('저장 실패');
    }
    setSaving(false);
  }

  async function handleOgImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const result = await apiPost('/api/admin/upload/image', formData);
      setSeo(prev => ({ ...prev, ogImage: result.url }));
    } catch {
      alert('이미지 업로드 실패');
    }
  }

  // FAQ helpers
  function addFaqItem() { setAeo(prev => ({ ...prev, faqItems: [...prev.faqItems, { question: '', answer: '' }] })); }
  function removeFaqItem(idx) { setAeo(prev => ({ ...prev, faqItems: prev.faqItems.filter((_, i) => i !== idx) })); }
  function updateFaqItem(idx, field, value) {
    setAeo(prev => ({ ...prev, faqItems: prev.faqItems.map((item, i) => i === idx ? { ...item, [field]: value } : item) }));
  }

  // HowTo helpers
  function addHowToStep() { setAeo(prev => ({ ...prev, howToSteps: [...prev.howToSteps, { name: '', text: '' }] })); }
  function removeHowToStep(idx) { setAeo(prev => ({ ...prev, howToSteps: prev.howToSteps.filter((_, i) => i !== idx) })); }
  function updateHowToStep(idx, field, value) {
    setAeo(prev => ({ ...prev, howToSteps: prev.howToSteps.map((item, i) => i === idx ? { ...item, [field]: value } : item) }));
  }

  function getScoreColor(score) {
    if (!score && score !== 0) return 'var(--admin-text-muted)';
    if (score >= 80) return 'var(--admin-success)';
    if (score >= 50) return 'var(--admin-warning)';
    return 'var(--admin-danger)';
  }

  function getScoreClass(score) {
    if (score >= 80) return 'score-high';
    if (score >= 50) return 'score-mid';
    return 'score-low';
  }

  function toggleGroup(groupName) {
    setOpenGroups(prev => ({ ...prev, [groupName]: !prev[groupName] }));
  }

  const editingPage = ALL_PAGES.find(p => p.id === editingId);

  return (
    <AdminGuard>
      <div className="admin-page-header">
        <h1>페이지 SEO 관리</h1>
        <p style={{ color: 'var(--admin-text-secondary)', marginBottom: '1.6rem' }}>
          메인페이지, 카테고리 리스트, 서브카테고리 리스트 등 정적 페이지의 SEO/AEO/GEO를 관리합니다.
        </p>
      </div>

      {PAGE_GROUPS.map(group => {
        const isOpen = openGroups[group.group];
        return (
        <div key={group.group} className="admin-card" style={{ marginBottom: '1.2rem' }}>
          <div
            onClick={() => toggleGroup(group.group)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              cursor: 'pointer', userSelect: 'none', marginBottom: isOpen ? '1.2rem' : 0,
            }}
          >
            <h2 style={{ marginBottom: 0, display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: '2.4rem', height: '2.4rem', borderRadius: '6px',
                background: 'var(--admin-primary-soft)', color: 'var(--admin-primary)',
                fontSize: '1.2rem', transition: 'transform 0.2s ease',
                transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
              }}>
                &#9654;
              </span>
              {group.group}
              <span style={{ fontSize: '1.2rem', color: 'var(--admin-text-muted)', fontWeight: 400 }}>
                ({group.pages.length})
              </span>
            </h2>
          </div>
          {isOpen && (
          <table className="admin-table">
            <thead>
              <tr>
                <th>페이지</th>
                <th>경로</th>
                <th>Meta Title</th>
                <th>SEO</th>
                <th>AEO</th>
                <th>GEO</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {group.pages.map(page => {
                const data = pagesData[page.id];
                return (
                  <tr key={page.id} style={editingId === page.id ? { background: 'var(--admin-primary-soft)' } : {}}>
                    <td><strong>{page.label}</strong></td>
                    <td style={{ color: 'var(--admin-text-muted)', fontFamily: 'monospace', fontSize: '1.2rem' }}>{page.path}</td>
                    <td>{data?.metaTitle || <span style={{ color: 'var(--admin-text-muted)' }}>미설정</span>}</td>
                    <td>
                      <span className={`admin-score ${getScoreClass(data?.seoScore || 0)}`}>
                        {data?.seoScore ?? '-'}
                      </span>
                    </td>
                    <td>
                      <span className={`admin-score ${getScoreClass(data?.aeoScore || 0)}`}>
                        {data?.aeoScore ?? '-'}
                      </span>
                    </td>
                    <td>
                      <span className={`admin-score ${getScoreClass(data?.geoScore || 0)}`}>
                        {data?.geoScore ?? '-'}
                      </span>
                    </td>
                    <td>
                      <button
                        className={`admin-btn admin-btn-sm ${editingId === page.id ? 'admin-btn-warning' : 'admin-btn-primary'}`}
                        onClick={() => editingId === page.id ? setEditingId(null) : startEdit(page.id)}
                      >
                        {editingId === page.id ? '닫기' : '편집'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          )}
        </div>
        );
      })}

      {editingId && (
        <div className="admin-card" style={{ marginTop: '1.6rem', borderLeft: '3px solid var(--admin-primary)' }}>
          <h2 style={{ marginBottom: '0.4rem' }}>{editingPage?.label}</h2>
          <p style={{ color: 'var(--admin-text-muted)', marginBottom: '1.6rem', fontFamily: 'monospace', fontSize: '1.3rem' }}>{editingPage?.path}</p>

          <div className="admin-tabs">
            {[
              { key: 'seo', label: 'SEO' },
              { key: 'aeo', label: 'AEO' },
              { key: 'geo', label: 'GEO' },
            ].map(tab => (
              <button
                key={tab.key}
                className={activeTab === tab.key ? 'active' : ''}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* SEO Tab */}
          {activeTab === 'seo' && (
            <div className="admin-form">
              <div className="form-group">
                <label>포커스 키워드</label>
                <input type="text" value={seo.focusKeyword} onChange={e => setSeo({ ...seo, focusKeyword: e.target.value })} placeholder="예: 강남 안과, 눈 건강" />
              </div>
              <div className="form-group">
                <label>Meta Title <span style={{ color: 'var(--admin-text-muted)' }}>({seo.metaTitle.length}/60)</span></label>
                <input type="text" value={seo.metaTitle} onChange={e => setSeo({ ...seo, metaTitle: e.target.value })} />
                {seo.metaTitle.length > 0 && (
                  <div className="form-hint" style={{ color: seo.metaTitle.length >= 30 && seo.metaTitle.length <= 60 ? 'var(--admin-success)' : 'var(--admin-danger)' }}>
                    {seo.metaTitle.length < 30 ? '30자 이상 권장' : seo.metaTitle.length > 60 ? '60자 이하 권장' : '적절한 길이입니다'}
                  </div>
                )}
              </div>
              <div className="form-group">
                <label>Meta Description <span style={{ color: 'var(--admin-text-muted)' }}>({seo.metaDescription.length}/160)</span></label>
                <textarea rows={3} value={seo.metaDescription} onChange={e => setSeo({ ...seo, metaDescription: e.target.value })} />
                {seo.metaDescription.length > 0 && (
                  <div className="form-hint" style={{ color: seo.metaDescription.length >= 120 && seo.metaDescription.length <= 160 ? 'var(--admin-success)' : 'var(--admin-danger)' }}>
                    {seo.metaDescription.length < 120 ? '120자 이상 권장' : seo.metaDescription.length > 160 ? '160자 이하 권장' : '적절한 길이입니다'}
                  </div>
                )}
              </div>
              <div className="form-group">
                <label>Canonical URL</label>
                <input type="text" value={seo.canonicalUrl} onChange={e => setSeo({ ...seo, canonicalUrl: e.target.value })} placeholder="https://blog.theoneeye.com/..." />
              </div>
              <div className="form-group">
                <label>OG Title</label>
                <input type="text" value={seo.ogTitle} onChange={e => setSeo({ ...seo, ogTitle: e.target.value })} />
              </div>
              <div className="form-group">
                <label>OG Description</label>
                <textarea rows={2} value={seo.ogDescription} onChange={e => setSeo({ ...seo, ogDescription: e.target.value })} />
              </div>
              <div className="form-group">
                <label>OG Image</label>
                <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                  <input type="text" value={seo.ogImage} onChange={e => setSeo({ ...seo, ogImage: e.target.value })} style={{ flex: 1 }} />
                  <label className="admin-btn admin-btn-sm" style={{ cursor: 'pointer' }}>
                    업로드
                    <input type="file" accept="image/*" onChange={handleOgImageUpload} style={{ display: 'none' }} />
                  </label>
                </div>
                {seo.ogImage && <img src={seo.ogImage} alt="OG" style={{ maxWidth: '200px', marginTop: '0.6rem', borderRadius: '8px' }} />}
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>OG Type</label>
                  <select value={seo.ogType} onChange={e => setSeo({ ...seo, ogType: e.target.value })}>
                    <option value="website">website</option>
                    <option value="article">article</option>
                    <option value="profile">profile</option>
                  </select>
                </div>
                <div className="form-group">
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
                <input type="text" value={seo.robotsMeta} onChange={e => setSeo({ ...seo, robotsMeta: e.target.value })} placeholder="index, follow" />
              </div>
            </div>
          )}

          {/* AEO Tab */}
          {activeTab === 'aeo' && (
            <div className="admin-form">
              <div className="form-group">
                <label>JSON-LD Type</label>
                <select value={aeo.jsonLdType} onChange={e => setAeo({ ...aeo, jsonLdType: e.target.value })}>
                  <option value="Article">Article</option>
                  <option value="FAQPage">FAQPage</option>
                  <option value="HowTo">HowTo</option>
                  <option value="LocalBusiness">LocalBusiness</option>
                  <option value="MedicalBusiness">MedicalBusiness</option>
                  <option value="CollectionPage">CollectionPage</option>
                  <option value="WebPage">WebPage</option>
                </select>
              </div>

              <div className="form-group">
                <label>FAQ Items</label>
                {aeo.faqItems.map((item, idx) => (
                  <div key={idx} style={{ border: '1px solid var(--admin-border)', borderRadius: '8px', padding: '1.2rem', marginBottom: '0.8rem', background: 'var(--admin-bg)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', alignItems: 'center' }}>
                      <strong style={{ fontSize: '1.3rem' }}>FAQ #{idx + 1}</strong>
                      <button type="button" className="admin-btn admin-btn-sm admin-btn-danger" onClick={() => removeFaqItem(idx)}>삭제</button>
                    </div>
                    <textarea placeholder="질문" rows={2} value={item.question} onChange={e => updateFaqItem(idx, 'question', e.target.value)} style={{ width: '100%', marginBottom: '0.6rem' }} />
                    <textarea placeholder="답변" rows={3} value={item.answer} onChange={e => updateFaqItem(idx, 'answer', e.target.value)} style={{ width: '100%' }} />
                  </div>
                ))}
                <button type="button" className="admin-btn admin-btn-sm" onClick={addFaqItem}>+ FAQ 추가</button>
              </div>

              <div className="form-group">
                <label>HowTo Steps</label>
                {aeo.howToSteps.map((step, idx) => (
                  <div key={idx} style={{ border: '1px solid var(--admin-border)', borderRadius: '8px', padding: '1.2rem', marginBottom: '0.8rem', background: 'var(--admin-bg)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', alignItems: 'center' }}>
                      <strong style={{ fontSize: '1.3rem' }}>Step #{idx + 1}</strong>
                      <button type="button" className="admin-btn admin-btn-sm admin-btn-danger" onClick={() => removeHowToStep(idx)}>삭제</button>
                    </div>
                    <input type="text" placeholder="단계 이름" value={step.name} onChange={e => updateHowToStep(idx, 'name', e.target.value)} style={{ width: '100%', marginBottom: '0.6rem' }} />
                    <textarea placeholder="단계 설명" rows={2} value={step.text} onChange={e => updateHowToStep(idx, 'text', e.target.value)} style={{ width: '100%' }} />
                  </div>
                ))}
                <button type="button" className="admin-btn admin-btn-sm" onClick={addHowToStep}>+ Step 추가</button>
              </div>

              <div className="form-group">
                <label>TL;DR 요약 <span style={{ color: 'var(--admin-text-muted)' }}>(40~80자 권장)</span></label>
                <textarea rows={3} value={aeo.tldrSummary} onChange={e => setAeo({ ...aeo, tldrSummary: e.target.value })} />
              </div>
              <div className="form-group">
                <label>최종 리뷰 날짜</label>
                <input type="date" value={aeo.lastReviewedAt ? aeo.lastReviewedAt.slice(0, 10) : ''} onChange={e => setAeo({ ...aeo, lastReviewedAt: e.target.value })} />
                <div className="form-hint">90일 이내 유지 권장</div>
              </div>
              <div className="form-group">
                <label>JSON-LD 수동 오버라이드</label>
                <textarea rows={6} value={aeo.jsonLdData} onChange={e => setAeo({ ...aeo, jsonLdData: e.target.value })} style={{ fontFamily: 'monospace' }} />
              </div>
            </div>
          )}

          {/* GEO Tab */}
          {activeTab === 'geo' && (
            <div className="admin-form">
              <div className="form-group">
                <label>병원명 (Business Name)</label>
                <input type="text" value={geo.businessName} onChange={e => setGeo({ ...geo, businessName: e.target.value })} placeholder="더원서울안과" />
              </div>
              <div className="form-group">
                <label>주소 (Address)</label>
                <input type="text" value={geo.address} onChange={e => setGeo({ ...geo, address: e.target.value })} placeholder="서울특별시 강남구 신사동..." />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>전화번호</label>
                  <input type="text" value={geo.phone} onChange={e => setGeo({ ...geo, phone: e.target.value })} placeholder="02-XXX-XXXX" />
                </div>
                <div className="form-group">
                  <label>영업시간</label>
                  <input type="text" value={geo.openingHours} onChange={e => setGeo({ ...geo, openingHours: e.target.value })} placeholder="월-금 09:00-18:00" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>위도 (Latitude)</label>
                  <input type="text" value={geo.latitude} onChange={e => setGeo({ ...geo, latitude: e.target.value })} placeholder="37.5XXX" />
                </div>
                <div className="form-group">
                  <label>경도 (Longitude)</label>
                  <input type="text" value={geo.longitude} onChange={e => setGeo({ ...geo, longitude: e.target.value })} placeholder="127.0XXX" />
                </div>
              </div>
              <div className="form-group">
                <label>서비스 지역 (Service Area)</label>
                <input type="text" value={geo.serviceArea} onChange={e => setGeo({ ...geo, serviceArea: e.target.value })} placeholder="강남구, 서초구, 송파구" />
              </div>
              <div className="form-group">
                <label>지역 키워드 <span style={{ color: 'var(--admin-text-muted)' }}>(쉼표 구분, 3개 이상 권장)</span></label>
                <input type="text" value={geo.localKeywords} onChange={e => setGeo({ ...geo, localKeywords: e.target.value })} placeholder="강남안과, 신사역안과, 강남역안과, 강남라식" />
              </div>
              <div className="form-group">
                <label>지도 URL (Map URL)</label>
                <input type="text" value={geo.mapUrl} onChange={e => setGeo({ ...geo, mapUrl: e.target.value })} placeholder="https://map.naver.com/..." />
              </div>
              <div className="form-group">
                <label>진료과목 / 서비스</label>
                <textarea rows={3} value={geo.departmentServices} onChange={e => setGeo({ ...geo, departmentServices: e.target.value })} placeholder="망막, 녹내장, 백내장, 노안, 라식, 라섹, 드림렌즈..." />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>예약 URL</label>
                  <input type="text" value={geo.appointmentUrl} onChange={e => setGeo({ ...geo, appointmentUrl: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>응급 연락처</label>
                  <input type="text" value={geo.emergencyContact} onChange={e => setGeo({ ...geo, emergencyContact: e.target.value })} />
                </div>
              </div>
            </div>
          )}

          <div style={{ marginTop: '2rem', display: 'flex', gap: '0.8rem' }}>
            <button className="admin-btn admin-btn-primary admin-btn-lg" onClick={handleSave} disabled={saving}>
              {saving ? '저장 중...' : '저장'}
            </button>
            <button className="admin-btn admin-btn-lg" onClick={() => setEditingId(null)}>취소</button>
          </div>
        </div>
      )}
    </AdminGuard>
  );
}
