'use client';
import Link from 'next/link';
import { ReactNode } from 'react';
import { logoutAdmin } from '../login/actions';
import { useRouter } from 'next/navigation';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  const handleLogout = async () => {
    await logoutAdmin();
    router.push('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100" dir="rtl">
      <aside className="w-64 bg-brand-black text-white flex flex-col">
        <div className="p-6 text-center border-b border-gray-800">
          <h2 className="text-2xl font-bold text-brand-gold">محل الأمير</h2>
          <p className="text-xs text-gray-400 mt-1">لوحة تحكم الإدارة</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin" className="block p-3 rounded-lg hover:bg-gray-800 transition">📊 الإحصائيات</Link>
          <Link href="/admin/orders" className="block p-3 rounded-lg hover:bg-gray-800 transition">📦 إدارة الطلبات</Link>
          <Link href="/admin/products" className="block p-3 rounded-lg hover:bg-gray-800 transition">📱 إدارة المنتجات</Link>
        </nav>
        <div className="p-4 border-t border-gray-800 flex flex-col gap-2">
          <button onClick={handleLogout} className="w-full text-center p-2 text-sm bg-red-900/50 text-red-400 rounded hover:bg-red-900 transition">
            تسجيل الخروج 🚪
          </button>
          <Link href="/" className="block text-center p-2 text-sm text-gray-400 hover:text-white transition">
            العودة للمتجر 🌍
          </Link>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}