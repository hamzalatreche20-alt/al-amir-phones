'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: 'الإحصائيات', href: '/admin', icon: '📊' },
    { name: 'إدارة الطلبات', href: '/admin/orders', icon: '📦' },
    { name: 'إدارة المنتجات', href: '/admin/products', icon: '📱' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row text-right" dir="rtl">
      
      {/* شريط علوي للهواتف فقط */}
      <div className="md:hidden bg-brand-black text-white p-4 flex justify-between items-center shadow-md z-30 relative">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-2xl p-1 focus:outline-none text-brand-gold"
          >
            {sidebarOpen ? '✕' : '☰'}
          </button>
          <span className="font-bold text-white">لوحة تحكم الأمير</span>
        </div>
        <Link href="/" className="text-xs bg-brand-gold text-brand-black px-3 py-1.5 rounded-lg font-bold">
          المتجر ↗
        </Link>
      </div>

      {/* خلفية معتمة عند فتح القائمة في الهاتف */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
        ></div>
      )}

      {/* القائمة الجانبية (Sidebar) */}
      <aside className={`
        fixed top-0 bottom-0 right-0 z-40 w-64 bg-brand-black text-white p-6 flex flex-col justify-between shadow-2xl
        transition-transform duration-300 ease-in-out md:translate-x-0 md:static
        ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div>
          <div className="mb-8 hidden md:block">
            <h2 className="text-2xl font-bold text-brand-gold">محل الأمير</h2>
            <p className="text-xs text-gray-400 mt-1">لوحة تحكم الإدارة</p>
          </div>

          <div className="flex justify-between items-center mb-6 md:hidden">
            <h2 className="text-xl font-bold text-brand-gold">القائمة</h2>
            <button onClick={() => setSidebarOpen(false)} className="text-gray-400 text-xl p-2">✕</button>
          </div>

          <nav className="space-y-2 mt-2 md:mt-0">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition ${
                    isActive 
                      ? 'bg-brand-gold text-brand-black shadow-lg' 
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-gray-800">
          <Link 
            href="/" 
            className="block text-center w-full bg-brand-gold text-brand-black py-3 rounded-xl font-bold hover:bg-yellow-500 transition"
          >
            الذهاب للمتجر ↗
          </Link>
        </div>
      </aside>

      {/* محتوى الصفحة الرئيسي */}
      <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
        {children}
      </main>

    </div>
  );
}