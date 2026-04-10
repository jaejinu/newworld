'use client';
import { useState, useEffect } from 'react';
import AdminGuard from '@/components/admin/common/AdminGuard';
import { apiGet, apiPatch } from '@/lib/api/client';

export default function SettingsPage() {
  const [admin, setAdmin] = useState({ name: '', email: '' });
  const [nameForm, setNameForm] = useState('');
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [savingName, setSavingName] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => { fetchAdmin(); }, []);

  async function fetchAdmin() {
    try {
      const data = await apiGet('/api/admin/me');
      setAdmin(data);
      setNameForm(data.name || '');
    } catch (e) { console.error(e); }
  }

  async function handleNameSave(e) {
    e.preventDefault();
    setSavingName(true);
    try {
      await apiPatch('/api/admin/me', { name: nameForm });
      setAdmin(prev => ({ ...prev, name: nameForm }));
      alert('이름이 변경되었습니다.');
    } catch (err) {
      alert('이름 변경 실패');
    }
    setSavingName(false);
  }

  async function handlePasswordSave(e) {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('새 비밀번호가 일치하지 않습니다.');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      alert('비밀번호는 6자 이상이어야 합니다.');
      return;
    }
    setSavingPassword(true);
    try {
      await apiPatch('/api/admin/me', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      alert('비밀번호가 변경되었습니다.');
    } catch (err) {
      alert('비밀번호 변경 실패. 현재 비밀번호를 확인해주세요.');
    }
    setSavingPassword(false);
  }

  return (
    <AdminGuard>
      <div className="admin-page-header">
        <h1>설정</h1>
      </div>

      <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
        <h3>관리자 정보</h3>
        <div style={{ marginBottom: '1rem', color: '#666' }}>
          <p><strong>이메일:</strong> {admin.email}</p>
          <p><strong>이름:</strong> {admin.name}</p>
        </div>
      </div>

      <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
        <h3>이름 변경</h3>
        <form onSubmit={handleNameSave} className="admin-form">
          <div className="form-group">
            <label>이름</label>
            <input value={nameForm} onChange={e => setNameForm(e.target.value)} required />
          </div>
          <button type="submit" className="admin-btn admin-btn-primary" disabled={savingName}>
            {savingName ? '저장 중...' : '이름 변경'}
          </button>
        </form>
      </div>

      <div className="admin-card">
        <h3>비밀번호 변경</h3>
        <form onSubmit={handlePasswordSave} className="admin-form">
          <div className="form-group">
            <label>현재 비밀번호</label>
            <input
              type="password"
              value={passwordForm.currentPassword}
              onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>새 비밀번호</label>
            <input
              type="password"
              value={passwordForm.newPassword}
              onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              required
              minLength={6}
            />
          </div>
          <div className="form-group">
            <label>새 비밀번호 확인</label>
            <input
              type="password"
              value={passwordForm.confirmPassword}
              onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              required
              minLength={6}
            />
          </div>
          <button type="submit" className="admin-btn admin-btn-primary" disabled={savingPassword}>
            {savingPassword ? '저장 중...' : '비밀번호 변경'}
          </button>
        </form>
      </div>
    </AdminGuard>
  );
}
