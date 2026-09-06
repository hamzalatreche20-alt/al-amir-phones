'use client';
import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/utils/supabase';

export default function CheckoutCash({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    wilaya: '',
  });

  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await supabase.from('products').select('*').eq('id', id).single();
      if (data) setProduct(data);
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // إرسال الطلب (بما أنه نقداً: الدفعة هي السعر الكامل، والأشهر = 0)
    const { error } = await supabase.from('orders').insert([
      {
        product_id: id,
        customer_name: formData.fullName,
        phone: formData.phone,
        wilaya: formData.wilaya,
        down_payment: product.price, // الدفعة هي السعر كاملاً
        months: 0, // 0 أشهر يعني شراء كاش
        status: 'جديد'
      }
    ]);

    if (error) {
      alert("حدث خطأ أثناء إرسال الطلب: " + error.message);
    } else {
      setIsSubmitted(true);
    }
    setIsSubmitting(false);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-gray-500">جاري التجهيز... ⏳</div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center font-bold text-red-500">المنتج غير موجود.</div>;

  // واجهة النجاح بعد الطلب
  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center max-w-md w-full">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">✅</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">تم تأكيد طلبك بنجاح!</h2>
          <p className="text-gray-600 mb-6">سنتصل بك قريباً على الرقم <strong dir="ltr">{formData.phone}</strong> لتأكيد الشحن إلى ولاية {formData.wilaya}.</p>
          <Link href="/store" className="bg-brand-black text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition block">
            العودة للمتجر
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <Link href="/store" className="text-sm text-gray-500 hover:text-brand-black mb-6 inline-block font-bold">
          ← العودة للمتجر
        </Link>
        
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {/* شريط علوي أخضر لتمييز الشراء النقدي */}
          <div className="bg-green-600 p-6 text-white text-center">
            <h1 className="text-2xl font-bold mb-1">طلب شراء نقداً (الدفع عند الاستلام) 💵</h1>
            <p className="opacity-90">أنت تطلب الآن هاتف: {product.name}</p>
          </div>

          <div className="p-6 md:p-8">
            {/* ملخص الهاتف */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex justify-between items-center mb-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 relative bg-white rounded-lg border border-gray-200 p-1">
                  <Image src={product.image} alt={product.name} fill className="object-contain" />
                </div>
                <div>
                  <p className="font-bold text-gray-800">المبلغ الإجمالي للدفع:</p>
                  <p className="text-xs text-gray-500">يُدفع عند استلام الهاتف</p>
                </div>
              </div>
              <span className="text-2xl font-extrabold text-brand-blue">{product.price.toLocaleString()} دج</span>
            </div>

            {/* نموذج إدخال البيانات */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">الاسم الكامل *</label>
                <input required type="text" name="fullName" onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-green-500" placeholder="مثال: محمد الأمين" />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">رقم الهاتف *</label>
                <input required type="tel" name="phone" onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-green-500 text-left" dir="ltr" placeholder="0555 00 00 00" />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">ولاية التوصيل *</label>
                <select required name="wilaya" onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-green-500 bg-white">
                  <option value="">اختر ولايتك...</option>
                  <option value="الجزائر">الجزائر (16)</option>
                  <option value="وهران">وهران (31)</option>
                  <option value="قسنطينة">قسنطينة (25)</option>
                  <option value="سطيف">سطيف (19)</option>
                  <option value="عنابة">عنابة (23)</option>
                  <option value="باتنة">باتنة (05)</option>
                  {/* يمكنك إضافة باقي الولايات لاحقاً */}
                </select>
              </div>

              <button type="submit" disabled={isSubmitting} className={`w-full py-4 rounded-xl font-bold text-lg text-white transition mt-4 ${isSubmitting ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}>
                {isSubmitting ? 'جاري إرسال الطلب... ⏳' : 'تأكيد الطلب وإرساله 🚀'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}