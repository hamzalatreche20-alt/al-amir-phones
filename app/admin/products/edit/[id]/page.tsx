'use client';
import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { supabase } from '@/utils/supabase';

export default function EditProduct({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // حالات البيانات النصية (أضفنا sale_type هنا)
  const [formData, setFormData] = useState({
    name: '', brand: '', ram: '', storage: '', screen: '', battery: '', 
    camera: '', processor: '', price: '', min_down_payment: '', badge: '',
    sale_type: 'both' 
  });

  // حالات الصورة الرئيسية
  const [existingMainImage, setExistingMainImage] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // حالات معرض الصور
  const [existingGallery, setExistingGallery] = useState<string[]>([]);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  // جلب بيانات الهاتف من قاعدة البيانات
  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
      if (data) {
        setFormData({
          name: data.name || '', brand: data.brand || '', ram: data.ram || '', storage: data.storage || '',
          screen: data.screen || '', battery: data.battery || '', camera: data.camera || '',
          processor: data.processor || '', price: data.price?.toString() || '',
          min_down_payment: data.min_down_payment?.toString() || '', badge: data.badge || '',
          sale_type: data.sale_type || 'both' // 👈 جلب نوع البيع من القاعدة
        });
        setExistingMainImage(data.image || '');
        setExistingGallery(data.gallery || []);
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setGalleryFiles(filesArray);
      const previewsArray = filesArray.map(file => URL.createObjectURL(file));
      setGalleryPreviews(previewsArray);
    }
  };

  const removeExistingGalleryImage = (indexToRemove: number) => {
    setExistingGallery(existingGallery.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    let finalImageUrl = existingMainImage; 
    let finalGalleryUrls = [...existingGallery]; 

    // رفع الصورة الرئيسية
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `main_${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('products').upload(fileName, imageFile);
      if (!uploadError) {
        const { data } = supabase.storage.from('products').getPublicUrl(fileName);
        finalImageUrl = data.publicUrl;
      }
    }

    // رفع صور المعرض الجديدة
    if (galleryFiles.length > 0) {
      for (const file of galleryFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `gallery_${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('products').upload(fileName, file);
        if (!uploadError) {
          const { data } = supabase.storage.from('products').getPublicUrl(fileName);
          finalGalleryUrls.push(data.publicUrl);
        }
      }
    }

    // تحديث البيانات في قاعدة البيانات
    const { error } = await supabase.from('products').update({
      name: formData.name,
      brand: formData.brand,
      ram: formData.ram,
      storage: formData.storage,
      processor: formData.processor,
      screen: formData.screen,
      battery: formData.battery,
      camera: formData.camera,
      price: parseInt(formData.price),
      min_down_payment: formData.sale_type === 'cash' ? 0 : parseInt(formData.min_down_payment), // 👈 تصفير الدفعة لو كان كاش
      image: finalImageUrl,
      gallery: finalGalleryUrls,
      badge: formData.badge,
      sale_type: formData.sale_type // 👈 حفظ التعديل على نوع البيع
    }).eq('id', id);

    if (error) {
      alert("حدث خطأ أثناء تعديل الهاتف: " + error.message);
    } else {
      alert('تم تعديل بيانات الهاتف وصوره بنجاح! ✅');
      window.location.href = '/admin/products'; 
    }
    
    setIsSubmitting(false);
  };

  if (loading) return <div className="text-center p-12 font-bold text-gray-500">جاري تحميل بيانات الهاتف... ⏳</div>;

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <Link href="/admin/products" className="text-gray-500 hover:text-brand-black text-sm mb-2 inline-block">← العودة لإدارة المنتجات</Link>
          <h1 className="text-3xl font-bold text-gray-800">✏️ تعديل الهاتف: {formData.name}</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-8">
        
        {/* ================= قسم الصور ================= */}
        <div>
          <h2 className="text-lg font-bold border-b pb-2 mb-4">صور الهاتف</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-brand-light p-4 rounded-xl border border-gray-200">
              <label className="block text-sm font-bold text-gray-700 mb-3">الصورة الرئيسية الحالية / التعديل</label>
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-shrink-0 items-center justify-center bg-white overflow-hidden relative">
                  <img src={imagePreview || existingMainImage} alt="Main" className="w-full h-full object-contain" />
                </div>
                <div>
                  <input type="file" accept="image/*" onChange={handleMainImageChange} className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-200 file:text-brand-black hover:file:bg-gray-300 cursor-pointer" />
                  <p className="text-xs text-gray-400 mt-2">اتركه فارغاً إذا كنت لا تريد تغيير الصورة الرئيسية.</p>
                </div>
              </div>
            </div>

            <div className="bg-brand-light p-4 rounded-xl border border-gray-200">
              <label className="block text-sm font-bold text-gray-700 mb-3">إدارة صور المعرض</label>
              {existingGallery.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-2">الصور الحالية (اضغط على ❌ للحذف):</p>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {existingGallery.map((img, index) => (
                      <div key={index} className="w-16 h-16 border border-gray-300 rounded-lg flex-shrink-0 bg-white overflow-hidden relative group">
                        <img src={img} alt={`Gallery ${index}`} className="w-full h-full object-contain" />
                        <button type="button" onClick={() => removeExistingGalleryImage(index)} className="absolute inset-0 bg-black/50 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition">❌</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <input type="file" accept="image/*" multiple onChange={handleGalleryChange} className="w-full text-sm mb-3 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-200 file:text-brand-black hover:file:bg-gray-300 cursor-pointer" />
              {galleryPreviews.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-2 border-t pt-2 mt-2">
                  {galleryPreviews.map((preview, index) => (
                    <div key={index} className="w-16 h-16 border border-green-300 rounded-lg flex-shrink-0 bg-white overflow-hidden relative"><img src={preview} alt={`New Gallery ${index}`} className="w-full h-full object-contain" /><span className="absolute bottom-0 right-0 bg-green-500 text-white text-[10px] px-1 rounded-tl-lg">جديد</span></div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ================= المعلومات الأساسية ================= */}
        <div>
          <h2 className="text-lg font-bold border-b pb-2 mb-4">المعلومات الأساسية</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div><label className="block text-sm font-bold text-gray-700 mb-2">اسم الهاتف *</label><input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-brand-blue" /></div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">العلامة التجارية *</label>
              <select required name="brand" value={formData.brand} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-brand-blue bg-white">
                <option value="">اختر الماركة...</option>
                <option value="Samsung">Samsung</option>
                <option value="Apple">Apple</option>
                <option value="Xiaomi">Xiaomi</option>
                <option value="Redmi">Redmi</option>
                <option value="Oppo">Oppo</option>
                <option value="Realme">Realme</option>
              </select>
            </div>
          </div>
        </div>

        {/* ================= المواصفات التقنية ================= */}
        <div>
          <h2 className="text-lg font-bold border-b pb-2 mb-4">المواصفات التقنية</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div><label className="block text-sm font-bold text-gray-700 mb-2">الذاكرة (RAM)</label><input type="text" name="ram" value={formData.ram} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-brand-blue" /></div>
            <div><label className="block text-sm font-bold text-gray-700 mb-2">التخزين (Storage)</label><input type="text" name="storage" value={formData.storage} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-brand-blue" /></div>
            <div><label className="block text-sm font-bold text-gray-700 mb-2">المعالج</label><input type="text" name="processor" value={formData.processor} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-brand-blue" /></div>
            <div><label className="block text-sm font-bold text-gray-700 mb-2">الشاشة</label><input type="text" name="screen" value={formData.screen} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-brand-blue" /></div>
            <div><label className="block text-sm font-bold text-gray-700 mb-2">البطارية</label><input type="text" name="battery" value={formData.battery} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-brand-blue" /></div>
            <div><label className="block text-sm font-bold text-gray-700 mb-2">الكاميرا</label><input type="text" name="camera" value={formData.camera} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-brand-blue" /></div>
          </div>
        </div>

        {/* ================= التسعير ونوع البيع ================= */}
        <div>
          <h2 className="text-lg font-bold border-b pb-2 mb-4">التسعير والعرض</h2>
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* 👈 القائمة المنسدلة للتعديل على نوع البيع */}
            <div className="col-span-2 md:col-span-1 bg-yellow-50 p-4 rounded-xl border border-yellow-200">
              <label className="block text-sm font-bold text-gray-800 mb-2">أين تريد عرض هذا الهاتف؟ *</label>
              <select name="sale_type" value={formData.sale_type} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-brand-gold bg-white font-bold">
                <option value="both">كاش وتقسيط (يظهر في المتجرين)</option>
                <option value="cash">للبيع كاش فقط 💵</option>
                <option value="installment">للبيع بالتقسيط فقط 💳</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">شارة العرض (Badge)</label>
              <select name="badge" value={formData.badge} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-brand-blue bg-white">
                <option value="">بدون شارة</option>
                <option value="جديد">جديد</option>
                <option value="الأكثر طلباً">الأكثر طلباً</option>
                <option value="تخفيض">تخفيض</option>
              </select>
            </div>

            <div><label className="block text-sm font-bold text-gray-700 mb-2">السعر النقدي (كاش) *</label><input required type="number" name="price" value={formData.price} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-brand-blue" /></div>
            
            {/* إخفاء الدفعة الأولى لو اخترت كاش فقط */}
            {formData.sale_type !== 'cash' && (
              <div><label className="block text-sm font-bold text-gray-700 mb-2">الدفعة الأولى المطلوبة (دج) *</label><input required type="number" name="min_down_payment" value={formData.min_down_payment} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-brand-blue" /></div>
            )}
            
          </div>
        </div>

        <div className="pt-4 border-t">
          <button type="submit" disabled={isSubmitting} className={`w-full py-4 rounded-xl font-bold text-lg text-white transition flex justify-center items-center gap-2 ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-brand-blue hover:bg-blue-800'}`}>
            {isSubmitting ? 'جاري رفع الصور وحفظ التعديلات... ⏳' : 'حفظ التعديلات 💾'}
          </button>
        </div>
      </form>
    </div>
  );
}