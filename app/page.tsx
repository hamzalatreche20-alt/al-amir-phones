'use client';
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { supabase } from '@/utils/supabase';
import { storeConfig } from '../store.config'; // استيراد الإعدادات المركزية

export default function Home() {
  // حالة تخزين الهواتف
  const [phones, setPhones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 👈 حالات الإعدادات الديناميكية من لوحة التحكم
  const [minPercent, setMinPercent] = useState<number>(30); 
  const [maxMonths, setMaxMonths] = useState<number>(12);

  // حالات الحاسبة
  const [calcPrice, setCalcPrice] = useState<number>(100000);
  const [calcDownPayment, setCalcDownPayment] = useState<number>(30000);
  const [calcMonths, setCalcMonths] = useState<number>(6);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // جلب البيانات والإعدادات عند تحميل الصفحة
  useEffect(() => {
    const fetchData = async () => {
      // 1. جلب إعدادات المتجر (النسبة والأشهر)
      const { data: settingsData } = await supabase
        .from('store_settings')
        .select('*')
        .eq('id', 1)
        .single();
      
      if (settingsData) {
        setMinPercent(settingsData.down_payment_percent);
        setMaxMonths(settingsData.max_installment_months);
        // تحديث الدفعة الأولى الافتراضية في الحاسبة لتطابق النسبة
        setCalcDownPayment((100000 * settingsData.down_payment_percent) / 100);
      }

      // 2. جلب الهواتف
      const { data: phonesData } = await supabase
        .from('products')
        .select('*')
        .in('sale_type', ['installment', 'both'])
        .order('created_at', { ascending: false });
      
      if (phonesData) {
        setPhones(phonesData);
      }
      
      setLoading(false);
    };
    
    fetchData();
  }, []);

  // حساب القسط الشهري
  const calcRemaining = calcPrice - calcDownPayment;
  const calcMonthly = calcRemaining > 0 ? Math.ceil(calcRemaining / calcMonths) : 0;

  // توليد خيارات الأشهر ديناميكياً (3، 6، 9، 12... حسب الحد الأقصى)
  const monthOptions = [];
  for (let i = 3; i <= maxMonths; i += 3) {
    monthOptions.push(i);
  }
  if (!monthOptions.includes(maxMonths)) {
    monthOptions.push(maxMonths);
    monthOptions.sort((a,b) => a - b);
  }

  // الأسئلة الشائعة متصلة بالبيانات الديناميكية
  const faqs = [
    { q: "كيف يمكنني شراء هاتف بالتقسيط؟", a: "الأمر بسيط جداً! اختر الهاتف الذي يناسبك، استخدم حاسبة التقسيط لمعرفة الدفعة الأولى والقسط الشهري، ثم اضغط على 'اطلب الآن' واملأ الاستمارة. سنتواصل معك لتأكيد الطلب." },
    { q: "ما هي شروط التقسيط المطلوبة؟", a: "نطلب وثائق بسيطة تشمل: نسخة من بطاقة التعريف الوطنية، شهادة ميلاد، وصك بريدي مشطوب. قد تختلف الشروط قليلاً حسب مدة التقسيط." },
    { q: "كم تبلغ الدفعة الأولى؟", a: `تبدأ الدفعة الأولى من ${minPercent}% من إجمالي سعر الهاتف، ويمكنك زيادتها لتقليل قيمة الأقساط الشهرية.` },
    { q: "هل الهواتف أصلية ومضمونة؟", a: "نعم، جميع الهواتف التي نبيعها أصلية 100% وتأتي بعلبة مغلقة مع ضمان المتجر." },
  ];

  return (
    <div className="flex flex-col items-center w-full overflow-x-hidden">
      
      {/* ================= HERO SECTION ================= */}
      <section className="bg-brand-light py-20 w-full">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-brand-black mb-6">
            أهلاً بك في <span className="text-brand-gold">{storeConfig.name}</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
            اكتشف أحدث الهواتف الذكية بأسعار تنافسية. اختر طريقة الدفع التي تناسبك: الدفع نقداً عند الاستلام، أو التقسيط المريح حتى {maxMonths} شهراً!
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link href="/store" className="w-full sm:w-auto bg-green-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition flex items-center justify-center gap-2 shadow-lg shadow-green-600/20 transform hover:-translate-y-1">
              <span>تسوق نقداً (كاش) 💵</span>
            </Link>
            <a href="#phones" className="w-full sm:w-auto bg-brand-black text-brand-gold px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition flex items-center justify-center gap-2 shadow-lg transform hover:-translate-y-1">
              <span>تسوق بالتقسيط 💳</span>
            </a>
          </div>
        </div>
      </section>

      {/* ================= TRUST BAR ================= */}
      <section className="w-full bg-white border-b border-gray-200 py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="flex flex-col items-center gap-2">
              <span className="bg-brand-light p-3 rounded-full text-2xl">📱</span>
              <h3 className="font-bold text-brand-black text-sm md:text-base">هواتف أصلية</h3>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="bg-brand-light p-3 rounded-full text-2xl">💰</span>
              <h3 className="font-bold text-brand-black text-sm md:text-base">أسعار تنافسية</h3>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="bg-brand-light p-3 rounded-full text-2xl">🤝</span>
              <h3 className="font-bold text-brand-black text-sm md:text-base">تقسيط ميسر</h3>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="bg-brand-light p-3 rounded-full text-2xl">⚡</span>
              <h3 className="font-bold text-brand-black text-sm md:text-base">خدمة سريعة</h3>
            </div>
          </div>
        </div>
      </section>

      {/* ================= PRODUCTS SECTION ================= */}
      <section id="phones" className="w-full py-16 bg-brand-light">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-black mb-4">📱 أحدث الهواتف المتوفرة</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              <div className="col-span-4 text-center py-12 text-gray-500 font-bold">جاري التحميل...</div>
            ) : phones.length === 0 ? (
              <div className="col-span-4 text-center py-12 text-gray-500 font-bold">لا توجد هواتف حالياً.</div>
            ) : (
              phones.map((phone) => (
                <div key={phone.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow border border-gray-100 overflow-hidden flex flex-col">
                  <div className="relative h-56 w-full bg-gray-50">
                    <Image 
                      src={phone.image} 
                      alt={phone.name} 
                      fill 
                      className="object-cover opacity-80 mix-blend-multiply"
                    />
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

                    <div className="grid grid-cols-2 gap-2 mt-auto">
                      <Link href={`/product/${phone.id}`} className="text-center py-2 border border-brand-black text-brand-black rounded-lg hover:bg-gray-50 font-bold text-sm">
                        التفاصيل
                      </Link>
                      <Link href={`/checkout/${phone.id}`} className="text-center py-2 bg-brand-black text-white rounded-lg hover:bg-gray-800 font-bold text-sm">
                        اطلب الآن
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ================= CALCULATOR SECTION ================= */}
      <section id="calculator" className="w-full py-16 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-brand-black mb-4">🧮 احسب قسط هاتفك بسهولة</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              استخدم الحاسبة لمعرفة القسط الشهري المناسب لك. نحن نوفر خطط دفع مرنة تمتد من 3 أشهر إلى {maxMonths} شهراً، لتتمكن من شراء هاتفك المفضل بدون ضغوط مالية.
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2 text-gray-700"><span className="text-green-500">✅</span> دفعة أولى تبدأ من {minPercent}%</li>
              <li className="flex items-center gap-2 text-gray-700"><span className="text-green-500">✅</span> إجراءات سريعة وبدون تعقيدات</li>
            </ul>
          </div>

          <div className="bg-brand-light p-6 md:p-8 rounded-3xl shadow-lg border border-gray-100 relative">
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">سعر الهاتف التقريبي (دج)</label>
                <input 
                  type="number" 
                  value={calcPrice} 
                  onChange={(e) => {
                    const price = Number(e.target.value);
                    setCalcPrice(price);
                    setCalcDownPayment((price * minPercent) / 100); // تحديث الدفعة تلقائياً
                  }} 
                  className="w-full rounded-xl border-gray-300 shadow-sm p-3 focus:ring-brand-blue" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">الدفعة الأولى ({minPercent}% على الأقل)</label>
                <input 
                  type="number" 
                  value={calcDownPayment} 
                  onChange={(e) => setCalcDownPayment(Number(e.target.value))} 
                  className="w-full rounded-xl border-gray-300 shadow-sm p-3 focus:ring-brand-blue" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">مدة التقسيط</label>
                <select 
                  value={calcMonths} 
                  onChange={(e) => setCalcMonths(Number(e.target.value))} 
                  className="w-full rounded-xl border-gray-300 shadow-sm p-3 focus:ring-brand-blue bg-white"
                >
                  {monthOptions.map(m => (
                    <option key={m} value={m}>{m} أشهر</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-8 bg-brand-black p-6 rounded-2xl text-center text-white shadow-inner">
              <p className="text-gray-300 text-sm mb-1">القسط الشهري التقديري</p>
              <p className="text-4xl font-extrabold text-brand-gold mb-4">{calcMonthly.toLocaleString()} <span className="text-lg">دج</span></p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FAQ SECTION ================= */}
      <section id="faq" className="w-full py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-black mb-4">الأسئلة الشائعة</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-xl overflow-hidden transition-all duration-300">
                <button 
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full text-right px-6 py-4 bg-gray-50 hover:bg-gray-100 flex justify-between items-center"
                >
                  <span className="font-bold text-brand-black">{faq.q}</span>
                  <span className="text-brand-gold text-xl font-bold">{openFaq === index ? '−' : '+'}</span>
                </button>
                <div className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openFaq === index ? 'max-h-40 py-4 opacity-100' : 'max-h-0 py-0 opacity-0'}`}>
                  <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}