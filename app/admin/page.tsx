'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    newInstallmentOrders: 0,
    newCashOrders: 0,
    confirmedOrders: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        // 1. حساب إجمالي الهواتف في المتجر
        const { count: productsCount } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true });

        // 2. حساب طلبات التقسيط الجديدة (أشهر أكبر من 0)
        const { count: newInstallmentCount } = await supabase
          .from('orders')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'جديد')
          .gt('months', 0); // المدة أكبر من صفر تعني تقسيط

        // 3. حساب طلبات الكاش الجديدة (أشهر تساوي 0)
        const { count: newCashCount } = await supabase
          .from('orders')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'جديد')
          .eq('months', 0); // المدة تساوي صفر تعني كاش

        // 4. حساب الطلبات المؤكدة (جميع الأنواع)
        const { count: confirmedOrdersCount } = await supabase
          .from('orders')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'مؤكد');

        // تحديث الأرقام في الواجهة
        setStats({
          totalProducts: productsCount || 0,
          newInstallmentOrders: newInstallmentCount || 0,
          newCashOrders: newCashCount || 0,
          confirmedOrders: confirmedOrdersCount || 0
        });

      } catch (error) {
        console.error("حدث خطأ أثناء جلب الإحصائيات:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">📊 نظرة عامة مفصلة</h1>
      
      {/* شبكة البطاقات أصبحت 4 أعمدة في الشاشات الكبيرة */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* 1. إحصائيات المنتجات */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center hover:shadow-md transition relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-2 h-full bg-brand-gold"></div>
          <div className="flex justify-between items-center w-full">
            <div>
              <p className="text-gray-500 text-sm font-bold mb-1">إجمالي الهواتف</p>
              {loading ? (
                <div className="w-6 h-6 border-4 border-brand-gold border-t-transparent rounded-full animate-spin mt-2"></div>
              ) : (
                <h3 className="text-4xl font-extrabold text-brand-black">{stats.totalProducts}</h3>
              )}
            </div>
            <div className="w-12 h-12 bg-yellow-50 text-brand-gold rounded-full flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform">📱</div>
          </div>
        </div>

        {/* 2. إحصائيات طلبات التقسيط */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center hover:shadow-md transition relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-2 h-full bg-brand-blue"></div>
          <div className="flex justify-between items-center w-full">
            <div>
              <p className="text-gray-500 text-sm font-bold mb-1">طلبات تقسيط جديدة</p>
              {loading ? (
                <div className="w-6 h-6 border-4 border-brand-blue border-t-transparent rounded-full animate-spin mt-2"></div>
              ) : (
                <h3 className="text-4xl font-extrabold text-brand-blue">{stats.newInstallmentOrders}</h3>
              )}
            </div>
            <div className="w-12 h-12 bg-blue-50 text-brand-blue rounded-full flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform">💳</div>
          </div>
        </div>

        {/* 3. إحصائيات طلبات الكاش */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center hover:shadow-md transition relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-2 h-full bg-green-500"></div>
          <div className="flex justify-between items-center w-full">
            <div>
              <p className="text-gray-500 text-sm font-bold mb-1">طلبات كاش جديدة</p>
              {loading ? (
                <div className="w-6 h-6 border-4 border-green-500 border-t-transparent rounded-full animate-spin mt-2"></div>
              ) : (
                <h3 className="text-4xl font-extrabold text-green-600">{stats.newCashOrders}</h3>
              )}
            </div>
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform">💵</div>
          </div>
        </div>

        {/* 4. إحصائيات الطلبات المؤكدة */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center hover:shadow-md transition relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-2 h-full bg-gray-800"></div>
          <div className="flex justify-between items-center w-full">
            <div>
              <p className="text-gray-500 text-sm font-bold mb-1">الطلبات المؤكدة</p>
              {loading ? (
                <div className="w-6 h-6 border-4 border-gray-800 border-t-transparent rounded-full animate-spin mt-2"></div>
              ) : (
                <h3 className="text-4xl font-extrabold text-gray-800">{stats.confirmedOrders}</h3>
              )}
            </div>
            <div className="w-12 h-12 bg-gray-100 text-gray-800 rounded-full flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform">✅</div>
          </div>
        </div>

      </div>
      
      {/* رسالة ترحيبية إضافية */}
      <div className="mt-12 bg-brand-black text-white p-8 rounded-3xl shadow-lg relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold rounded-full filter blur-[80px] opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
         <h2 className="text-2xl font-bold mb-2 relative z-10">مرحباً بك في لوحة تحكم محل الأمير 👋</h2>
         <p className="text-gray-400 relative z-10 max-w-2xl text-sm leading-relaxed">
           تم تحديث لوحة الإحصائيات لتعطيك نظرة دقيقة على نوعية المبيعات. يمكنك الآن معرفة الطلبات الجديدة بنوعيها (كاش وتقسيط) بمجرد دخولك، مما يساعدك على تسريع خدمة الزبائن وتلبية طلباتهم.
         </p>
      </div>
    </div>
  );
}