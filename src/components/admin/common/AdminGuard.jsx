'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/lib/contexts/AdminAuthContext';
import AdminSidebar from './AdminSidebar';

export default function AdminGuard({ children }) {
  const { admin, loading } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !admin) {
      router.push('/admin/login');
    }
  }, [admin, loading, router]);

  if (loading) {
    return <div className="admin-wrap"><div className="admin-loading">로딩 중...</div></div>;
  }

  if (!admin) return null;

  return (
    <>
      <AdminSidebar />
      <main className="admin-main">
        {children}
      </main>
    </>
  );
}
