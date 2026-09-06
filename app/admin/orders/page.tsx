'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, installment, cash, new

  useEffect(() => {
    const fetchOrders = async () => {
      const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (data) setOrders(data);
      setLoading(false);
    };
    fetchOrders();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', id);
    if (!error) setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  const handleDeleteOrder = async (id: string) => {
    if (window.confirm('هل أنت متأكد أنك تريد مسح هذا الطلب نهائياً؟')) {
      const { error } = await supabase.from('orders').delete().eq('id', id);
      if (!error) setOrders(orders.filter(o => o.id !== id));
    }
  };

  // 👈 فلترة الطلبات بناءً على الزر الذي ضغط عليه التاجر
  const filteredOrders = orders.filter(order => {
    if (filter === 'new') return order.status === 'جديد';
    if (filter === 'installment') return order.months > 0;
    if (filter === 'cash') return order.months === 0;
    return true; // all
  });

  if (loading) return <div className="p-8 text-center font-bold text-xl">جاري تحميل الطلبات...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-brand-black mb-6 border-b pb-4">📦 إدارة الطلبات</h1>

      {/* 👈 أزرار الفلترة (التبويبات) */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-lg font-bold whitespace-nowrap transition ${filter === 'all' ? 'bg-brand-black text-brand-gold' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>الكل</button>
        <button onClick={() => setFilter('new')} className={`px-4 py-2 rounded-lg font-bold whitespace-nowrap transition ${filter === 'new' ? 'bg-brand-black text-brand-gold' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>🆕 الطلبات الجديدة</button>
        <button onClick={() => setFilter('installment')} className={`px-4 py-2 rounded-lg font-bold whitespace-nowrap transition ${filter === 'installment' ? 'bg-brand-black text-brand-gold' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>💳 طلبات التقسيط</button>
        <button onClick={() => setFilter('cash')} className={`px-4 py-2 rounded-lg font-bold whitespace-nowrap transition ${filter === 'cash' ? 'bg-brand-black text-brand-gold' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>💵 طلبات الكاش</button>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center border border-gray-100">
          <p className="text-gray-500 text-lg">لا توجد طلبات في هذا القسم.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-gray-50 border-b border-gray-100 text-brand-black">
                <tr>
                  <th className="p-4 font-bold">النوع</th>
                  <th className="p-4 font-bold">الزبون</th>
                  <th className="p-4 font-bold">رقم الهاتف</th>
                  <th className="p-4 font-bold">الولاية</th>
                  <th className="p-4 font-bold">المبلغ/الدفعة</th>
                  <th className="p-4 font-bold">الأشهر</th>
                  <th className="p-4 font-bold">الحالة</th>
                  <th className="p-4 font-bold text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition">
                    {/* التمييز البصري بين الكاش والتقسيط */}
                    <td className="p-4 font-bold">
                      {order.months === 0 
                        ? <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">💵 كاش</span> 
                        : <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">💳 تقسيط</span>}
                    </td>
                    <td className="p-4 font-bold">{order.customer_name}</td>
                    <td className="p-4" dir="ltr">{order.phone}</td>
                    <td className="p-4">{order.wilaya}</td>
                    <td className="p-4 font-bold text-gray-800">
                      {order.months === 0 ? 'سعر كامل' : `${order.down_payment.toLocaleString()} دج`}
                    </td>
                    <td className="p-4 text-gray-500">{order.months === 0 ? '-' : `${order.months} أشهر`}</td>
                    <td className="p-4">
                      <select
                        value={order.status || 'جديد'}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`text-sm rounded-lg p-2 font-bold border-0 outline-none ${order.status === 'مكتمل' ? 'bg-green-100 text-green-700' : order.status === 'ملغى' ? 'bg-red-100 text-red-700' : order.status === 'قيد المعالجة' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}
                      >
                        <option value="جديد">جديد 🟢</option>
                        <option value="قيد المعالجة">قيد المعالجة ⏳</option>
                        <option value="مكتمل">مكتمل ✅</option>
                        <option value="ملغى">ملغى ❌</option>
                      </select>
                    </td>
                    <td className="p-4 text-center">
                      <button onClick={() => handleDeleteOrder(order.id)} className="text-red-500 hover:bg-red-100 p-2 rounded-lg transition" title="مسح الطلب">🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}