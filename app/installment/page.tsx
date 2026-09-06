'use client';
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { supabase } from '@/utils/supabase';

export default function InstallmentStore() {
  const [phones, setPhones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [minPercent, setMinPercent] = useState<number>(30);

  useEffect(() => {
    const fetchData = async () => {
      // 1. جلب نسبة التقسيط من الإعدادات
      const { data: settings } = await supabase
        .from('store_settings')
        .select('down_payment_percent')
        .eq('id', 1)
        .single();
        
      if (settings) {
        setMinPercent(settings.down_payment_percent);
      }

      // 2. جلب الهواتف المتاحة للتقسيط (التي نوعها installment أو both)
      const { data: phonesData } = await supabase
        .from('products')
        .select('*')
        .in('sale_type', ['installment', 'both'])
        .order('created_at', { ascending: false });
      
      if (phonesData) setPhones(phonesData);
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="container mx-auto px-4 py-16 bg-brand-light min-h-screen">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-brand-black mb-4">💳 متجر التقسيط</h1>
        <p className="text-gray-600 mb-6">تسوق أحدث الهواتف وادفع بالتقسيط المريح حسب ميزانيتك</p>
        
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
           <Link href="/" className="bg-brand-black text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-800 transition">
             → العودة للرئيسية
           </Link>
           <Link href="/store" className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-700 transition">
             الذهاب لمتجر الكاش 💵
           </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-4 text-center py-12 text-gray-500 font-bold">جاري تحميل هواتف التقسيط...</div>
        ) : phones.length === 0 ? (
          <div className="col-span-4 text-center py-12 text-gray-500 font-bold">لا توجد هواتف متاحة للتقسيط حالياً.</div>
        ) : (
          phones.map((phone) => (
            <div key={phone.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-lg transition">
              <div className="relative h-56 w-full bg-gray-50">
                <Image src={phone.image} alt={phone.name} fill className="object-cover opacity-90 mix-blend-multiply" />
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-brand-black mb-1">{phone.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{phone.ram}GB RAM | {phone.storage}GB</p>
                
                <div className="flex justify-between items-end mb-6 mt-auto">
                  <div>
                    <p className="text-xs text-gray-400">السعر النقدي</p>
                    <p className="font-semibold text-gray-800 line-through text-sm">{phone.price?.toLocaleString()} دج</p>
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-brand-blue font-bold">الدفعة الأولى ({minPercent}%)</p>
                    <p className="text-brand-blue font-bold text-lg">{((phone.price * minPercent) / 100).toLocaleString()} دج</p>
                  </div>
                </div>

                {/* 👈 الزر يوجه إلى صفحة التقسيط القديمة التي برمجناها */}
                <Link href={`/checkout/${phone.id}`} className="w-full py-3 bg-brand-black text-brand-gold text-center rounded-xl hover:bg-gray-800 font-bold text-sm shadow-md transition flex items-center justify-center gap-2">
                  <span>طلب بالتقسيط</span>
                  <span>💳</span>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}