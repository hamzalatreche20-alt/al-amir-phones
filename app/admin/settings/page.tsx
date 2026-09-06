'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase'; // تأكد أن مسار الاستيراد صحيح حسب مشروعك

export default function SettingsPage() {
  const [percent, setPercent] = useState<number>(30);
  const [months, setMonths] = useState<number>(12);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // جلب الإعدادات الحالية من قاعدة البيانات
  useEffect(() => {
    const fetchSettings = async () => {
      const { data, error } = await supabase
        .from('store_settings')
        .select('*')
        .eq('id', 1)
        .single();
      
      if (data) {
        setPercent(data.down_payment_percent);
        setMonths(data.max_installment_months);
      }
      setLoading(false);
    };
    fetchSettings();
  }, []);

  // دالة حفظ الإعدادات الجديدة
  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    
    const { error } = await supabase
      .from('store_settings')
      .update({ 
        down_payment_percent: percent,
        max_installment_months: months 
      })
      .eq('id', 1);
      
    setSaving(false);
    
    if (error) {
      setMessage('❌ حدث خطأ أثناء الحفظ');
    } else {
      setMessage('✅ تم حفظ الإعدادات بنجاح!');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (loading) return <div className="p-8 text-center font-bold">جاري تحميل الإعدادات...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-brand-black mb-8 border-b pb-4">⚙️ إعدادات نظام التقسيط</h1>
      
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="space-y-6">
          
          {/* إعداد نسبة الدفعة الأولى */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">
              نسبة الدفعة الأولى (%)
            </label>
            <p className="text-sm text-gray-500 mb-3">هذه النسبة ستطبق تلقائياً على حاسبة التقسيط في الصفحة الرئيسية.</p>
            <div className="relative">
              <input 
                type="number" 
                min="10" max="100"
                value={percent} 
                onChange={(e) => setPercent(Number(e.target.value))}
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-brand-gold focus:border-brand-gold p-3"
              />
              <span className="absolute left-4 top-3 font-bold text-gray-400">%</span>
            </div>
          </div>

          {/* إعداد أقصى مدة تقسيط */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">
              الحد الأقصى لأشهر التقسيط
            </label>
            <div className="relative">
              <input 
                type="number" 
                min="3" max="36"
                value={months} 
                onChange={(e) => setMonths(Number(e.target.value))}
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-brand-gold focus:border-brand-gold p-3"
              />
              <span className="absolute left-4 top-3 font-bold text-gray-400">أشهر</span>
            </div>
          </div>

          {/* زر الحفظ */}
          <button 
            onClick={handleSave}
            disabled={saving}
            className={`w-full font-bold py-3 px-4 rounded-xl transition ${
              saving ? 'bg-gray-400 text-gray-200 cursor-not-allowed' : 'bg-brand-black text-brand-gold hover:bg-gray-800'
            }`}
          >
            {saving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
          </button>

          {/* رسالة النجاح أو الخطأ */}
          {message && (
            <div className={`p-4 rounded-lg text-center font-bold mt-4 ${message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {message}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}