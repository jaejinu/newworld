import { AdminAuthProvider } from '@/lib/contexts/AdminAuthContext';
import './admin.css';

export const metadata = {
  title: '관리자 - 더원서울안과 블로그',
};

export default function AdminLayout({ children }) {
  return (
    <AdminAuthProvider>
      <div className="admin-wrap">
        {children}
      </div>
    </AdminAuthProvider>
  );
}
