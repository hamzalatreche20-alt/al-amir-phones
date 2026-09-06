'use client';
import { useState, use } from "react"; // تأكد من استيراد use
import Link from "next/link";
import Image from "next/image";
import { supabase } from '@/utils/supabase';
// بيانات وهمية 
const samplePhones = [
  { id: "1", name: "Samsung Galaxy S24 Ultra", price: 245000, min_down_payment: 73500, image: "https://images.unsplash.com/photo-1707227251642-129eb884a22b?w=200&q=80" },
  { id: "2", name: "iPhone 15 Pro Max", price: 285000, min_down_payment: 85500, image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=200&q=80" },
];

const wilayas = ["الجزائر", "وهران", "قسنطينة", "عنابة", "سطيف", "باتنة", "البليدة", "الشلف"];

// التعديل هنا: تعريف params كـ Promise
export default function Checkout({ params }: { params: Promise<{ id: string }> }) {
  
  // التعديل هنا: فك تشفير params باستخدام use()
  const { id } = use(params);
  
  // استخدام id المستخرج للبحث عن الهاتف
  const product = samplePhones.find((p) => p.id === id) || samplePhones[0];
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "", phone: "", wilaya: "الجزائر", downPayment: product.min_down_payment, months: 6
  });

  const remainingAmount = product.price - formData.downPayment;
  const monthlyInstallment = Math.ceil(remainingAmount / formData.months);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 👈 إرسال الطلب إلى جدول orders
    const { error } = await supabase.from('orders').insert([
      {
        product_id: id,
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
      setIsSubmitted(true); // إظهار رسالة النجاح
    }
  };

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
                <input type="number" min={product.min_down_payment} max={product.price} value={formData.downPayment} onChange={(e) => setFormData({...formData, downPayment: Number(e.target.value)})} className="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-brand-gold" />
                <p className="text-xs text-gray-500 mt-1">الحد الأدنى: {product.min_down_payment.toLocaleString()} دج</p>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">تعديل مدة التقسيط</label>
                <select value={formData.months} onChange={(e) => setFormData({...formData, months: Number(e.target.value)})} className="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-brand-gold bg-white">
                  <option value={3}>3 أشهر</option>
                  <option value={6}>6 أشهر</option>
                  <option value={9}>9 أشهر</option>
                  <option value={12}>12 شهراً</option>
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