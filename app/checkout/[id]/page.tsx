'use client';
import { useState, useEffect, use } from "react"; 
import Link from "next/link";
import Image from "next/image";
import { supabase } from '@/utils/supabase';

// تم إزالة الهواتف الوهمية بالكامل!
const wilayas = ["الجزائر", "وهران", "قسنطينة", "عنابة", "سطيف", "باتنة", "البليدة", "الشلف", "النعامة", "أخرى"];

export default function Checkout({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  // حالات تخزين بيانات الهاتف الحقيقية والإعدادات
  const [product, setProduct] = useState<any>(null);
  const [minPercent, setMinPercent] = useState<number>(30);
  const [maxMonths, setMaxMonths] = useState<number>(12);
  const [loading, setLoading] = useState(true);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "", phone: "", wilaya: "الجزائر", downPayment: 0, months: 6
  });

  // جلب بيانات الهاتف الحقيقي وإعدادات المتجر من قاعدة البيانات
  useEffect(() => {
    const fetchCheckoutData = async () => {
      // 1. جلب إعدادات التقسيط (النسبة والأشهر)
      let currentPercent = 30;
      let currentMaxMonths = 12;

      const { data: settingsData } = await supabase
        .from('store_settings')
        .select('*')
        .eq('id', 1)
        .single();
      
      if (settingsData) {
        currentPercent = settingsData.down_payment_percent;
        currentMaxMonths = settingsData.max_installment_months;
        setMinPercent(currentPercent);
        setMaxMonths(currentMaxMonths);
      }

      // 2. جلب تفاصيل الهاتف المحدد بالـ id
      const { data: phoneData } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (phoneData) {
        setProduct(phoneData);
        // تحديث الدفعة الأولى الافتراضية بناءً على نسبة المحل المحددة في الداشبورد
        const initialDownPayment = (phoneData.price * currentPercent) / 100;
        setFormData(prev => ({ 
          ...prev, 
          downPayment: initialDownPayment,
          // إذا كانت الأشهر الافتراضية (6) أكبر من الحد الأقصى للمحل، نغيرها
          months: Math.min(6, currentMaxMonths)
        }));
      }
      
      setLoading(false);
    };

    fetchCheckoutData();
  }, [id]);

  // حساب الأقساط
  const remainingAmount = product ? (product.price - formData.downPayment) : 0;
  const monthlyInstallment = remainingAmount > 0 ? Math.ceil(remainingAmount / formData.months) : 0;
  const actualMinDownPayment = product ? ((product.price * minPercent) / 100) : 0;

  // توليد خيارات الأشهر ديناميكياً 
  const monthOptions = [];
  for (let i = 3; i <= maxMonths; i += 3) {
    monthOptions.push(i);
  }
  if (!monthOptions.includes(maxMonths)) monthOptions.push(maxMonths);
  monthOptions.sort((a,b) => a - b);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    
    // إرسال الطلب إلى جدول orders
    const { error } = await supabase.from('orders').insert([
      {
        product_id: product.id,
        customer_name: formData.fullName,
        phone: formData.phone,
        wilaya: formData.wilaya,
        down_payment: formData.downPayment,
        months: formData.months,
        status: 'جديد'
      }
    ]);

    if (error) {
      alert("حدث خطأ أثناء الإرسال: " + error.message);
    } else {
      setIsSubmitted(true);
    }
  };

  if (loading) {
    return <div className="min-h-[60vh] flex items-center justify-center font-bold text-lg">جاري تجهيز طلبك... ⏳</div>;
  }

  if (!product && !loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-bold text-red-500 mb-4">عذراً، لم نتمكن من العثور على هذا الهاتف.</h1>
        <Link href="/#phones" className="bg-brand-black text-white px-6 py-2 rounded-lg">العودة لتصفح الهواتف</Link>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center text-5xl mb-6">✅</div>
        <h1 className="text-3xl font-bold text-brand-black mb-4">تم استلام طلبك بنجاح!</h1>
        <p className="text-gray-600 max-w-md mb-8">
          شكراً لك، {formData.fullName}. سيتواصل معك فريق محل الأمير قريباً جداً على الرقم {formData.phone} لتأكيد الطلب وتوضيح الإجراءات.
        </p>
        <Link href="/" className="bg-brand-black text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition">
          العودة للرئيسية
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <h1 className="text-3xl md:text-4xl font-bold text-brand-black mb-8 text-center">📋 تأكيد طلب التقسيط</h1>
      
      <div className="grid md:grid-cols-3 gap-8">
        
        {/* ملخص الطلب */}
        <div className="md:col-span-1 bg-brand-light p-6 rounded-2xl border border-gray-200 h-fit">
          <h3 className="font-bold text-lg mb-4 border-b border-gray-300 pb-2">ملخص الطلب</h3>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 relative bg-white rounded-lg border border-gray-200 overflow-hidden">
              <Image src={product.image} alt={product.name} fill className="object-contain p-2" />
            </div>
            <div>
              <p className="font-bold text-sm text-brand-black leading-tight">{product.name}</p>
              <p className="text-xs text-gray-500 mt-1">السعر: {product.price.toLocaleString()} دج</p>
            </div>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">الدفعة الأولى:</span>
              <span className="font-bold text-brand-black">{formData.downPayment.toLocaleString()} دج</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">مدة التقسيط:</span>
              <span className="font-bold text-brand-black">{formData.months} أشهر</span>
            </div>
            <div className="flex justify-between border-t border-gray-300 pt-3">
              <span className="text-brand-blue font-bold">القسط الشهري:</span>
              <span className="font-extrabold text-brand-blue text-lg">{monthlyInstallment.toLocaleString()} دج</span>
            </div>
          </div>
        </div>

        {/* نموذج البيانات */}
        <div className="md:col-span-2 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">الاسم الكامل *</label>
                <input required type="text" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} className="w-full border-gray-300 rounded-xl p-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-brand-blue" placeholder="الاسم واللقب" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">رقم الهاتف *</label>
                <input required type="tel" dir="ltr" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full border-gray-300 rounded-xl p-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-brand-blue" placeholder="0555 00 00 00" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">الولاية *</label>
              <select value={formData.wilaya} onChange={(e) => setFormData({...formData, wilaya: e.target.value})} className="w-full border-gray-300 rounded-xl p-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-brand-blue">
                {wilayas.map((w, i) => <option key={i} value={w}>{w}</option>)}
              </select>
            </div>

            <div className="grid md:grid-cols-2 gap-6 bg-brand-light p-4 rounded-xl border border-gray-200">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">تعديل الدفعة الأولى (دج)</label>
                <input 
                  type="number" 
                  min={actualMinDownPayment} 
                  max={product.price} 
                  value={formData.downPayment} 
                  onChange={(e) => setFormData({...formData, downPayment: Number(e.target.value)})} 
                  className="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-brand-gold" 
                />
                <p className="text-xs text-gray-500 mt-1">الحد الأدنى ({minPercent}%): {actualMinDownPayment.toLocaleString()} دج</p>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">تعديل مدة التقسيط</label>
                <select 
                  value={formData.months} 
                  onChange={(e) => setFormData({...formData, months: Number(e.target.value)})} 
                  className="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-brand-gold bg-white"
                >
                  {monthOptions.map(m => (
                    <option key={m} value={m}>{m} أشهر</option>
                  ))}
                </select>
              </div>
            </div>

            <button type="submit" className="w-full bg-brand-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition flex justify-center items-center gap-2">
              <span>إرسال طلب التقسيط الآن</span>
              <span>🚀</span>
            </button>
            <p className="text-xs text-center text-gray-400">لن يتم طلب أي مبالغ مالية عبر الإنترنت. الدفع يتم عند الاستلام وتوقيع العقد.</p>
          </form>
        </div>

      </div>
    </div>
  );
}