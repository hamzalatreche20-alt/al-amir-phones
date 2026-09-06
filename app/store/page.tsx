'use client';
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from '@/utils/supabase';

export default function CashStore() {
  const [phones, setPhones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase
        .from('products')
        .select('*')
        .in('sale_type', ['cash', 'both']) // 👈 هذا السطر هو الفلتر الجديد
        .order('created_at', { ascending: false });
      if (data) setPhones(data);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pt-12 pb-24">
      <div className="container mx-auto px-4">
        
        {/* رأس الصفحة */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-brand-black mb-4">🛒 المتجر (شراء نقداً)</h1>
          <p className="text-gray-600 text-lg">تسوق أحدث الهواتف الذكية بأسعار تنافسية - الدفع عند الاستلام 🤝</p>
          
          <div className="mt-6 flex justify-center gap-4">
            <Link href="/" className="px-6 py-2 bg-gray-200 text-gray-700 rounded-full font-bold hover:bg-gray-300 transition">
              عرض هواتف التقسيط
            </Link>
          </div>
        </div>

        {/* شبكة الهواتف */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            <div className="col-span-4 text-center py-12 text-gray-500 font-bold">جاري تحميل الهواتف... ⏳</div>
          ) : phones.length === 0 ? (
            <div className="col-span-4 text-center py-12 text-gray-500 font-bold">لا توجد هواتف مضافة حالياً.</div>
          ) : (
            phones.map((phone) => (
              <div key={phone.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100 overflow-hidden relative flex flex-col">
                {phone.badge && (
                  <span className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
                    {phone.badge}
                  </span>
                )}
                
                <div className="relative h-56 w-full bg-gray-50">
                  <Image 
                    src={phone.image} 
                    alt={phone.name} 
                    fill 
                    className="object-contain p-4 mix-blend-multiply transition-transform hover:scale-110 duration-300"
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                </div>

                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-lg font-bold text-brand-black mb-1">{phone.name}</h3>
                  <p className="text-sm text-gray-500 mb-4">{phone.ram}GB RAM | {phone.storage}GB</p>
                  
                  <div className="mb-6 mt-auto">
                    <p className="text-xs text-gray-400">السعر الإجمالي (نقداً)</p>
                    <p className="text-brand-blue font-extrabold text-2xl">{phone.price?.toLocaleString()} دج</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-auto">
                    <Link href={`/product/${phone.id}`} className="text-center py-2 border border-brand-black text-brand-black rounded-lg hover:bg-gray-50 transition text-sm font-bold">
                      التفاصيل
                    </Link>
                    <Link href={`/checkout-cash/${phone.id}`} className="text-center py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-bold flex justify-center items-center gap-1">
                      <span>شراء كاش</span>
                      <span>💵</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}