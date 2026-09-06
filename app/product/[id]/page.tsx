'use client';
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, use } from "react";
import { supabase } from '@/utils/supabase';

export default function ProductDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // حالات التقسيط ومعرض الصور
  const [selectedDuration, setSelectedDuration] = useState<number>(6);
  const [mainImage, setMainImage] = useState<string>(""); 

  // جلب بيانات الهاتف من Supabase
  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
      if (data) {
        setProduct(data);
        setMainImage(data.image); // جعل الصورة الرئيسية هي الصورة الافتراضية
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-xl font-bold text-gray-500">جاري تحميل تفاصيل الهاتف... ⏳</div>;
  }

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center text-xl font-bold text-red-500">الهاتف غير موجود أو تم حذفه.</div>;
  }

  // تجميع الصورة الأساسية مع صور المعرض الإضافية (إن وجدت)
  const allImages = product.gallery && product.gallery.length > 0 
    ? [product.image, ...product.gallery] 
    : [product.image];

  const remainingAmount = product.price - product.min_down_payment;
  const monthlyInstallment = Math.ceil(remainingAmount / selectedDuration);

  return (
    <div className="container mx-auto px-4 py-12">
      {/* مسار التنقل (Breadcrumb) */}
      <nav className="text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-brand-gold">الرئيسية</Link> / <span className="text-brand-black font-bold">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-12 bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-gray-100">
        
        {/* ================= معرض الصور التفاعلي ================= */}
        <div className="flex flex-col gap-4">
          {/* الصورة الرئيسية الكبيرة */}
          <div className="relative h-[400px] w-full bg-gray-50 rounded-2xl flex items-center justify-center p-8 border border-gray-100 transition-all duration-300">
            <Image src={mainImage} alt={product.name} fill className="object-contain mix-blend-multiply p-4 transition-opacity duration-300" />
          </div>
          
          {/* شريط الصور المصغرة (يظهر فقط إذا كان هناك أكثر من صورة) */}
          {allImages.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {allImages.map((img: string, index: number) => (
                <button 
                  key={index} 
                  onClick={() => setMainImage(img)}
                  className={`relative w-20 h-20 rounded-xl border-2 overflow-hidden bg-gray-50 flex-shrink-0 transition-all ${mainImage === img ? 'border-brand-blue shadow-md' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <Image src={img} alt={`${product.name} - صورة ${index + 1}`} fill className="object-contain p-2 mix-blend-multiply" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ================= تفاصيل المنتج والتقسيط ================= */}
        <div className="flex flex-col">
          <span className="text-brand-gold font-bold text-sm mb-2">{product.brand}</span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-brand-black mb-4">{product.name}</h1>
          
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
            <div>
              <p className="text-sm text-gray-500">السعر النقدي</p>
              <p className="text-xl font-bold text-gray-400 line-through">{product.price?.toLocaleString()} دج</p>
            </div>
            <div className="border-r-2 border-gray-200 pr-4">
              <p className="text-sm text-brand-blue font-bold">الدفعة الأولى المطلوبة</p>
              <p className="text-2xl font-extrabold text-brand-black">{product.min_down_payment?.toLocaleString()} دج</p>
            </div>
          </div>

          <h3 className="font-bold text-lg mb-3 text-brand-black">المواصفات التقنية:</h3>
          <ul className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm text-gray-600 mb-8">
            <li className="flex items-center gap-2"><strong>RAM:</strong> {product.ram}GB</li>
            <li className="flex items-center gap-2"><strong>التخزين:</strong> {product.storage}GB</li>
            <li className="flex items-center gap-2"><strong>الشاشة:</strong> {product.screen}</li>
            <li className="flex items-center gap-2"><strong>البطارية:</strong> {product.battery}</li>
            <li className="flex items-center gap-2"><strong>الكاميرا:</strong> {product.camera}</li>
            <li className="flex items-center gap-2"><strong>المعالج:</strong> {product.processor}</li>
          </ul>

          <h3 className="font-bold text-lg mb-3 text-brand-black">خطة التقسيط:</h3>
          <div className="bg-brand-light p-4 rounded-xl border border-gray-200 mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-bold text-gray-700">اختر المدة:</span>
              <div className="flex gap-2">
                {[3, 6, 9, 12].map((months) => (
                  <button 
                    key={months} 
                    onClick={() => setSelectedDuration(months)}
                    className={`px-3 py-1 rounded-lg text-sm font-bold transition ${selectedDuration === months ? 'bg-brand-black text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
                  >
                    {months}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-between items-center bg-white p-3 rounded-lg">
              <span className="text-sm text-gray-600">القسط الشهري لـ {selectedDuration} أشهر:</span>
              <span className="text-lg font-extrabold text-brand-blue">{monthlyInstallment.toLocaleString()} دج</span>
            </div>
          </div>

          <Link href={`/checkout/${product.id}`} className="w-full bg-brand-gold text-brand-black py-4 rounded-xl font-bold text-lg text-center hover:bg-yellow-500 shadow-lg shadow-brand-gold/30 transition transform hover:-translate-y-1">
            اطلب هذا الهاتف بالتقسيط
          </Link>
        </div>

      </div>
    </div>
  );
}