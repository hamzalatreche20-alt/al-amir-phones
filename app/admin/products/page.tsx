'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase'; // استيراد Supabase

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. جلب الهواتف من قاعدة البيانات عند فتح الصفحة
  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false }); // ترتيب من الأحدث للأقدم
      
      if (data) {
        setProducts(data);
      }
      setLoading(false);
    };
    
    fetchProducts();
  }, []);

  // 2. دالة الحذف الحقيقية من قاعدة البيانات
  const handleDelete = async (id: string) => {
    const isConfirmed = window.confirm("هل أنت متأكد أنك تريد حذف هذا الهاتف نهائياً؟");
    
    if (isConfirmed) {
      // حذف الهاتف من Supabase
      const { error } = await supabase.from('products').delete().eq('id', id);
      
      if (error) {
        alert("حدث خطأ أثناء الحذف: " + error.message);
      } else {
        // حذفه من الجدول في الشاشة فوراً
        setProducts(products.filter(product => product.id !== id));
        alert("تم حذف الهاتف بنجاح! 🗑️");
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">📱 إدارة المنتجات (الهواتف)</h1>
        
        <Link href="/admin/products/new" className="bg-brand-black text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 transition flex items-center gap-2">
          <span>+</span>
          <span>إضافة هاتف جديد</span>
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-sm">
              <th className="p-4 font-bold">اسم الهاتف</th>
              <th className="p-4 font-bold">العلامة التجارية</th>
              <th className="p-4 font-bold">السعر النقدي</th>
              <th className="p-4 font-bold">الدفعة الأولى</th>
              <th className="p-4 font-bold text-center">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500 font-bold">
                  جاري تحميل الهواتف من قاعدة البيانات... ⏳
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  لا توجد هواتف مضافة حالياً.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                  <td className="p-4 font-bold text-brand-black">{product.name}</td>
                  <td className="p-4 text-gray-600">{product.brand}</td>
                  <td className="p-4 text-brand-blue font-bold">{product.price?.toLocaleString()} دج</td>
                  <td className="p-4 text-gray-600">{product.min_down_payment?.toLocaleString()} دج</td>
                  <td className="p-4 flex justify-center gap-2">
                    <Link href={`/admin/products/edit/${product.id}`} className="text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded hover:bg-gray-200">
                      تعديل
                    </Link>
                    <button onClick={() => handleDelete(product.id)} className="text-sm bg-red-50 text-red-500 px-3 py-1 rounded hover:bg-red-100">
                      حذف
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}