'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // حالة الفلتر النشط (الكل، التقسيط، الكاش، جديد)
  const [activeFilter, setActiveFilter] = useState('all');

  // جلب الطلبات من قاعدة البيانات
  useEffect(() => {
    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*, products(name)')
        .order('created_at', { ascending: false });
      
      if (data) {
        setOrders(data);
      }
      setLoading(false);
    };
    fetchOrders();
  }, []);

  // دالة تحديث حالة الطلب
  const handleStatusChange = async (orderId: string, newStatus: string) => {
    const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
    if (error) {
      alert("حدث خطأ أثناء تحديث الحالة: " + error.message);
    } else {
      setOrders(orders.map(order => order.id === orderId ? { ...order, status: newStatus } : order));
    }
  };

  // ألوان الحالات (Badges)
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'جديد': return 'bg-blue-100 text-blue-700';
      case 'قيد المراجعة': return 'bg-yellow-100 text-yellow-700';
      case 'مؤكد': return 'bg-green-100 text-green-700';
      case 'مكتمل': return 'bg-gray-800 text-white';
      case 'ملغى': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('ar-DZ', options);
  };

  // 👈 دالة لفلترة الطلبات بناءً على الزر الذي تم ضغطه
  const filteredOrders = orders.filter(order => {
    if (activeFilter === 'cash') return order.months === 0;
    if (activeFilter === 'installment') return order.months > 0;
    if (activeFilter === 'new') return order.status === 'جديد';
    return true; // 'all'
  });

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">📦 إدارة الطلبات</h1>
        
        {/* أزرار الفلترة (Tabs) */}
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setActiveFilter('all')} 
            className={`px-4 py-2 rounded-lg text-sm font-bold transition ${activeFilter === 'all' ? 'bg-brand-black text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
          >
            الكل
          </button>
          <button 
            onClick={() => setActiveFilter('installment')} 
            className={`px-4 py-2 rounded-lg text-sm font-bold transition ${activeFilter === 'installment' ? 'bg-brand-blue text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
          >
            💳 طلبات التقسيط
          </button>
          <button 
            onClick={() => setActiveFilter('cash')} 
            className={`px-4 py-2 rounded-lg text-sm font-bold transition ${activeFilter === 'cash' ? 'bg-green-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
          >
            💵 طلبات الكاش
          </button>
          <button 
            onClick={() => setActiveFilter('new')} 
            className={`px-4 py-2 rounded-lg text-sm font-bold transition ${activeFilter === 'new' ? 'bg-red-500 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
          >
            🔴 الطلبات الجديدة فقط
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full text-right border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-sm">
              <th className="p-4 font-bold">رقم الطلب / التاريخ</th>
              <th className="p-4 font-bold">العميل / الاتصال</th>
              <th className="p-4 font-bold">المنتج المطلوب</th>
              <th className="p-4 font-bold">نوع الدفع وتفاصيله</th>
              <th className="p-4 font-bold text-center">حالة الطلب</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="p-8 text-center text-gray-500 font-bold">جاري تحميل الطلبات... ⏳</td></tr>
            ) : filteredOrders.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-gray-500">لا توجد طلبات في هذا القسم حالياً.</td></tr>
            ) : (
              filteredOrders.map((order) => {
                const productName = order.products?.name || "هاتف محذوف أو غير معروف";
                
                return (
                  <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                    
                    <td className="p-4">
                      <p className="font-bold text-brand-black" dir="ltr">ORD-{order.id.substring(0, 5).toUpperCase()}</p>
                      <p className="text-xs text-gray-500 mt-1">{formatDate(order.created_at)}</p>
                    </td>

                    <td className="p-4">
                      <p className="font-bold text-brand-black">{order.customer_name}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <p className="text-sm text-gray-600" dir="ltr">{order.phone}</p>
                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">{order.wilaya}</span>
                      </div>
                    </td>

                    <td className="p-4">
                      <p className="font-bold text-brand-blue">{productName}</p>
                    </td>

                    {/* 👈 عمود الدفع (توضيح هل هو كاش أم تقسيط) */}
                    <td className="p-4">
                      {order.months === 0 ? (
                        <div>
                          <span className="inline-block bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold mb-2">دفع كاش 💵</span>
                          <p className="text-sm text-gray-800">
                            المبلغ المطلوب: <span className="font-bold text-brand-black">{order.down_payment.toLocaleString()} دج</span>
                          </p>
                        </div>
                      ) : (
                        <div>
                          <span className="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold mb-2">تقسيط 💳</span>
                          <p className="text-sm text-gray-800">
                            الدفعة الأولى: <span className="font-bold">{order.down_payment.toLocaleString()} دج</span>
                          </p>
                          <p className="text-sm text-gray-600 mt-1">المدة: {order.months} أشهر</p>
                        </div>
                      )}
                    </td>

                    <td className="p-4 text-center">
                      <select 
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`text-sm font-bold px-3 py-1.5 rounded-full border-none cursor-pointer focus:ring-2 focus:ring-brand-gold outline-none ${getStatusBadge(order.status)}`}
                      >
                        <option value="جديد">🔵 جديد</option>
                        <option value="قيد المراجعة">🟡 قيد المراجعة</option>
                        <option value="مؤكد">🟢 مؤكد</option>
                        <option value="مكتمل">⚫ مكتمل</option>
                        <option value="ملغى">🔴 ملغى</option>
                      </select>
                      
                      <div className="mt-3 flex justify-center gap-2">
                        <a 
                          href={`https://wa.me/213${order.phone.startsWith('0') ? order.phone.substring(1) : order.phone}?text=السلام عليكم ${order.customer_name}، نتواصل معك من محل الأمير بخصوص طلبك لهاتف ${productName}`} 
                          target="_blank" 
                          className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded hover:bg-green-100 flex items-center gap-1"
                        >
                          <span>💬 واتساب</span>
                        </a>
                      </div>
                    </td>

                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}