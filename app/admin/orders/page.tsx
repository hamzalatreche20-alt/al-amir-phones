'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // جلب الطلبات من قاعدة البيانات
  useEffect(() => {
    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false }); // ترتيب من الأحدث للأقدم

      if (data) {
        setOrders(data);
      }
      setLoading(false);
    };
    fetchOrders();
  }, []);

  // دالة تغيير حالة الطلب (جديد، قيد المعالجة، مكتمل، ملغى)
  const handleStatusChange = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', id);

    if (!error) {
      setOrders(orders.map(order => order.id === id ? { ...order, status: newStatus } : order));
    }
  };

  // 👈 الدالة الجديدة: مسح الطلب
  const handleDeleteOrder = async (id: string) => {
    // إظهار رسالة تأكيد قبل الحذف
    const confirmDelete = window.confirm('هل أنت متأكد أنك تريد مسح هذا الطلب نهائياً؟ لا يمكن التراجع عن هذه الخطوة.');
    
    if (confirmDelete) {
      // الحذف من قاعدة البيانات
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', id);

      if (error) {
        alert('❌ حدث خطأ أثناء الحذف: ' + error.message);
      } else {
        // تحديث الواجهة لإخفاء الطلب المحذوف فوراً
        setOrders(orders.filter(order => order.id !== id));
      }
    }
  };

  if (loading) return <div className="p-8 text-center font-bold text-xl">جاري تحميل الطلبات...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-brand-black mb-8 border-b pb-4">📦 إدارة الطلبات</h1>

      {orders.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center border border-gray-100">
          <p className="text-gray-500 text-lg">لا توجد طلبات حتى الآن.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-gray-50 border-b border-gray-100 text-brand-black">
                <tr>
                  <th className="p-4 font-bold">تاريخ الطلب</th>
                  <th className="p-4 font-bold">اسم الزبون</th>
                  <th className="p-4 font-bold">رقم الهاتف</th>
                  <th className="p-4 font-bold">الولاية</th>
                  <th className="p-4 font-bold">الدفعة الأولى</th>
                  <th className="p-4 font-bold">الأشهر</th>
                  <th className="p-4 font-bold">الحالة</th>
                  <th className="p-4 font-bold text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition">
                    <td className="p-4 text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString('ar-DZ')}
                    </td>
                    <td className="p-4 font-bold">{order.customer_name}</td>
                    <td className="p-4" dir="ltr">{order.phone}</td>
                    <td className="p-4">{order.wilaya}</td>
                    <td className="p-4 font-bold text-brand-blue">{order.down_payment.toLocaleString()} دج</td>
                    <td className="p-4">{order.months}</td>
                    <td className="p-4">
                      <select
                        value={order.status || 'جديد'}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`text-sm rounded-lg p-2 font-bold border-0 outline-none ${
                          order.status === 'مكتمل' ? 'bg-green-100 text-green-700' :
                          order.status === 'ملغى' ? 'bg-red-100 text-red-700' :
                          order.status === 'قيد المعالجة' ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        <option value="جديد">جديد 🟢</option>
                        <option value="قيد المعالجة">قيد المعالجة ⏳</option>
                        <option value="مكتمل">مكتمل ✅</option>
                        <option value="ملغى">ملغى ❌</option>
                      </select>
                    </td>
                    <td className="p-4 text-center">
                      {/* 👈 زر الحذف الجديد */}
                      <button 
                        onClick={() => handleDeleteOrder(order.id)}
                        className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded-lg text-sm font-bold transition duration-200"
                        title="مسح الطلب"
                      >
                        🗑️ مسح
                      </button>
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