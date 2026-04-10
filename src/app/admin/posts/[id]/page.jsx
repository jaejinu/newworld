'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import AdminGuard from '@/components/admin/common/AdminGuard';
import { apiGet, apiPatch, apiUpload } from '@/lib/api/client';

const TiptapEditor = dynamic(() => import('@/components/admin/editor/TiptapEditor'), { ssr: false });

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id;

  const [categories, setCategories] = useState([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    title: '',
    slug: '',
    categoryId: '',
    content: '',
    thumbnail: '',
    tags: [],
    recommended: false,
    noticePost: false,
    editorPick: false,
  });

  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    Promise.all([
      apiGet('/api/admin/categories'),
      apiGet(`/api/admin/posts/${postId}`),
    ]).then(([cats, post]) => {
      setCategories(cats || []);
      if (post) {
        setForm({
          title: post.title || '',
          slug: post.slug || '',
          categoryId: post.categoryId || post.category?.id || '',
          content: post.content || '',
          thumbnail: post.thumbnail || '',
          tags: (post.tags || []).map(t => typeof t === 'string' ? t : t.name || '').filter(Boolean),
          recommended: post.recommended || false,
          noticePost: post.noticePost || false,
          editorPick: post.editorPick || false,
        });
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [postId]);

  function flatCategories() {
    const flat = [];
    (categories || []).forEach(cat => {
      flat.push(cat);
      if (cat.children) {
        cat.children.forEach(child => flat.push({ ...child, name: `ㄴ ${child.name}` }));
      }
    });
    return flat;
  }

  function updateField(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  function handleAddTag(e) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const tag = tagInput.trim().replace(/,/g, '');
      if (tag && !form.tags.includes(tag)) {
        updateField('tags', [...form.tags, tag]);
      }
      setTagInput('');
    }
  }

  function removeTag(tag) {
    updateField('tags', form.tags.filter(t => t !== tag));
  }

  async function handleThumbnailUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const result = await apiUpload('/api/admin/upload/image', formData);
      updateField('thumbnail', result.url || result.path);
    } catch (err) {
      alert('썸네일 업로드 실패');
    }
  }

  async function handleSave() {
    if (!form.title.trim()) {
      alert('제목을 입력하세요.');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        categoryId: form.categoryId ? Number(form.categoryId) : null,
      };
      await apiPatch(`/api/admin/posts/${postId}`, payload);
      router.push('/admin/posts');
    } catch (err) {
      alert('저장 실패: ' + (err.message || '알 수 없는 오류'));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <AdminGuard>
        <div className="admin-page-header">
          <h1>게시글 수정</h1>
        </div>
        <div className="admin-card" style={{ textAlign: 'center', padding: '40px' }}>
          로딩 중...
        </div>
      </AdminGuard>
    );
  }

  return (
    <AdminGuard>
      <div className="admin-page-header">
        <h1>게시글 수정</h1>
      </div>

      <div className="admin-card">
        <div className="admin-form">
          <div className="admin-form-group">
            <label>제목</label>
            <input
              type="text"
              value={form.title}
              onChange={e => updateField('title', e.target.value)}
              placeholder="게시글 제목"
              className="admin-input"
            />
          </div>

          <div className="admin-form-group">
            <label>슬러그</label>
            <input
              type="text"
              value={form.slug}
              onChange={e => updateField('slug', e.target.value)}
              placeholder="url-slug"
              className="admin-input"
            />
          </div>

          <div className="admin-form-group">
            <label>카테고리</label>
            <select
              value={form.categoryId}
              onChange={e => updateField('categoryId', e.target.value)}
              className="admin-select"
            >
              <option value="">카테고리 선택</option>
              {flatCategories().map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="admin-form-group">
            <label>썸네일</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <input type="file" accept="image/*" onChange={handleThumbnailUpload} />
              {form.thumbnail && (
                <img src={form.thumbnail} alt="썸네일 미리보기" style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 4 }} />
              )}
            </div>
          </div>

          <div className="admin-form-group">
            <label>내용</label>
            <TiptapEditor content={form.content} onChange={val => updateField('content', val)} />
          </div>

          <div className="admin-form-group">
            <label>태그</label>
            <div>
              <input
                type="text"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="태그 입력 후 Enter"
                className="admin-input"
              />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                {form.tags.map((tag, idx) => (
                  <span key={`${tag}-${idx}`} className="admin-badge admin-badge-info" style={{ cursor: 'pointer' }} onClick={() => removeTag(tag)}>
                    {tag} &times;
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="admin-form-group">
            <label>옵션</label>
            <div style={{ display: 'flex', gap: '20px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <input type="checkbox" checked={form.recommended} onChange={e => updateField('recommended', e.target.checked)} />
                추천
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <input type="checkbox" checked={form.noticePost} onChange={e => updateField('noticePost', e.target.checked)} />
                공지
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <input type="checkbox" checked={form.editorPick} onChange={e => updateField('editorPick', e.target.checked)} />
                에디터픽
              </label>
            </div>
          </div>

          <div className="admin-form-actions">
            <button onClick={() => router.push('/admin/posts')} className="admin-btn">취소</button>
            <button onClick={handleSave} disabled={saving} className="admin-btn admin-btn-primary">
              {saving ? '저장 중...' : '저장'}
            </button>
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}
