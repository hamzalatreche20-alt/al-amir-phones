'use client';
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { supabase } from '@/utils/supabase';
// بيانات وهمية للهواتف


// بيانات الأسئلة الشائعة
const faqs = [
  { q: "كيف يمكنني شراء هاتف بالتقسيط؟", a: "الأمر بسيط جداً! اختر الهاتف الذي يناسبك، استخدم حاسبة التقسيط لمعرفة الدفعة الأولى والقسط الشهري، ثم اضغط على 'اطلب الآن' واملأ الاستمارة. سنتواصل معك لتأكيد الطلب." },
  { q: "ما هي شروط التقسيط المطلوبة؟", a: "نطلب وثائق بسيطة تشمل: نسخة من بطاقة التعريف الوطنية، شهادة ميلاد، وصك بريدي مشطوب. قد تختلف الشروط قليلاً حسب مدة التقسيط." },
  { q: "كم تبلغ الدفعة الأولى؟", a: "تبدأ الدفعة الأولى من 30% من إجمالي سعر الهاتف، ويمكنك زيادتها لتقليل قيمة الأقساط الشهرية." },
  { q: "هل الهواتف أصلية ومضمونة؟", a: "نعم، جميع الهواتف التي نبيعها أصلية 100% وتأتي بعلبة مغلقة مع ضمان المتجر." },
];

export default function Home() {
  // حالة تخزين الهواتف الحقيقية
  const [phones, setPhones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // جلب البيانات من Supabase عند تحميل الصفحة
  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .in('sale_type', ['installment', 'both']) // 👈 هذا السطر هو الفلتر الجديد
        .order('created_at', { ascending: false });
      if (data) {
        setPhones(data);
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);
  // حالات الحاسبة
  const [calcPrice, setCalcPrice] = useState<number>(100000);
  const [calcDownPayment, setCalcDownPayment] = useState<number>(30000);
  const [calcMonths, setCalcMonths] = useState<number>(6);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const calcRemaining = calcPrice - calcDownPayment;
  const calcMonthly = calcRemaining > 0 ? Math.ceil(calcRemaining / calcMonths) : 0;

  return (
    <div className="flex flex-col items-center w-full overflow-x-hidden">
      
      {/* ================= HERO SECTION ================= */}
      <section className="bg-brand-light py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-brand-black mb-6">
            أهلاً بك في <span className="text-brand-gold">محل الأمير</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
            اكتشف أحدث الهواتف الذكية بأسعار تنافسية. اختر طريقة الدفع التي تناسبك: الدفع نقداً عند الاستلام، أو التقسيط المريح حتى 12 شهراً!
          </p>
          
          {/* 👈 الأزرار الجديدة لربط الكاش والتقسيط */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            
            {/* زر التوجه لصفحة الكاش */}
            <Link 
              href="/store" 
              className="w-full sm:w-auto bg-green-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition flex items-center justify-center gap-2 shadow-lg shadow-green-600/20 transform hover:-translate-y-1"
            >
              <span>تسوق نقداً (كاش) 💵</span>
            </Link>

            {/* زر النزول لقسم التقسيط في نفس الصفحة */}
            <a 
              href="#phones" 
              className="w-full sm:w-auto bg-brand-black text-brand-gold px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition flex items-center justify-center gap-2 shadow-lg transform hover:-translate-y-1"
            >
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
              <p className="text-xs text-gray-500">مضمونة 100%</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="bg-brand-light p-3 rounded-full text-2xl">💰</span>
              <h3 className="font-bold text-brand-black text-sm md:text-base">أسعار تنافسية</h3>
              <p className="text-xs text-gray-500">أفضل الأسعار في السوق</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="bg-brand-light p-3 rounded-full text-2xl">🤝</span>
              <h3 className="font-bold text-brand-black text-sm md:text-base">تقسيط ميسر</h3>
              <p className="text-xs text-gray-500">شروط مرنة تناسبك</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="bg-brand-light p-3 rounded-full text-2xl">⚡</span>
              <h3 className="font-bold text-brand-black text-sm md:text-base">خدمة سريعة</h3>
              <p className="text-xs text-gray-500">معالجة الطلب في 24 ساعة</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= PRODUCTS SECTION (القسم المطلوب) ================= */}
    <section id="phones" className="w-full py-16 bg-brand-light">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-black mb-4">📱 أحدث الهواتف المتوفرة</h2>
            <p className="text-gray-600">تصفح تشكيلتنا من الهواتف الذكية واختر ما يناسبك</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              <div className="col-span-4 text-center py-12 text-gray-500 font-bold">جاري تحميل أحدث الهواتف...</div>
            ) : phones.length === 0 ? (
              <div className="col-span-4 text-center py-12 text-gray-500 font-bold">لا توجد هواتف مضافة حالياً.</div>
            ) : (
              phones.map((phone) => (
                <div key={phone.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100 overflow-hidden relative flex flex-col">
                  {phone.badge && (
                    <span className="absolute top-4 right-4 bg-brand-gold text-white text-xs font-bold px-3 py-1 rounded-full z-10">
                      {phone.badge}
                    </span>
                  )}
                  
                  <div className="relative h-56 w-full bg-gray-50">
                    <Image 
                      src={phone.image} 
                      alt={phone.name} 
                      fill 
                      className="object-cover opacity-80 mix-blend-multiply"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
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
                        <p className="text-xs text-brand-blue font-bold">الدفعة الأولى من</p>
                        <p className="text-brand-blue font-bold text-lg">{phone.min_down_payment?.toLocaleString()} دج</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-auto">
                      <Link href={`/product/${phone.id}`} className="text-center py-2 border border-brand-black text-brand-black rounded-lg hover:bg-gray-50 transition text-sm font-bold">
                        التفاصيل
                      </Link>
                      <Link href={`/checkout/${phone.id}`} className="text-center py-2 bg-brand-black text-white rounded-lg hover:bg-gray-800 transition text-sm font-bold">
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
              استخدم الحاسبة لمعرفة القسط الشهري المناسب لك. نحن نوفر خطط دفع مرنة تمتد من 3 أشهر إلى 12 شهراً، لتتمكن من شراء هاتفك المفضل بدون ضغوط مالية.
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2 text-gray-700"><span className="text-green-500">✅</span> دفعة أولى تبدأ من 30%</li>
              <li className="flex items-center gap-2 text-gray-700"><span className="text-green-500">✅</span> إجراءات سريعة وبدون تعقيدات</li>
              <li className="flex items-center gap-2 text-gray-700"><span className="text-green-500">✅</span> شفافية تامة، بدون رسوم خفية</li>
            </ul>
          </div>

          <div className="bg-brand-light p-6 md:p-8 rounded-3xl shadow-lg border border-gray-100 relative">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-1 bg-brand-gold rounded-b-md"></div>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">سعر الهاتف التقريبي (دج)</label>
                <input type="number" value={calcPrice} onChange={(e) => setCalcPrice(Number(e.target.value))} className="w-full rounded-xl border-gray-300 shadow-sm p-3 focus:ring-2 focus:ring-brand-blue" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">الدفعة الأولى (دج)</label>
                <input type="number" value={calcDownPayment} onChange={(e) => setCalcDownPayment(Number(e.target.value))} className="w-full rounded-xl border-gray-300 shadow-sm p-3 focus:ring-2 focus:ring-brand-blue" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">مدة التقسيط</label>
                <select value={calcMonths} onChange={(e) => setCalcMonths(Number(e.target.value))} className="w-full rounded-xl border-gray-300 shadow-sm p-3 focus:ring-2 focus:ring-brand-blue bg-white">
                  <option value={3}>3 أشهر</option>
                  <option value={6}>6 أشهر</option>
                  <option value={9}>9 أشهر</option>
                  <option value={12}>12 شهراً</option>
                </select>
              </div>
            </div>

            <div className="mt-8 bg-brand-black p-6 rounded-2xl text-center text-white shadow-inner">
              <p className="text-gray-300 text-sm mb-1">القسط الشهري التقديري</p>
              <p className="text-4xl font-extrabold text-brand-gold mb-4">{calcMonthly.toLocaleString()} <span className="text-lg">دج</span></p>
              <button className="w-full bg-brand-gold text-brand-black py-3 rounded-xl font-bold hover:bg-yellow-500 transition">
                أرسل طلب تقسيط الآن
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS SECTION ================= */}
      <section id="how-it-works" className="w-full py-16 bg-brand-light border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-black mb-4">كيف يعمل التقسيط؟</h2>
            <p className="text-gray-600">4 خطوات بسيطة تفصلك عن هاتفك الجديد</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm text-center border border-gray-100">
              <div className="w-12 h-12 bg-brand-black text-brand-gold rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 border-4 border-brand-light">1</div>
              <h3 className="text-lg font-bold text-brand-black mb-2">اختر هاتفك</h3>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm text-center border border-gray-100">
              <div className="w-12 h-12 bg-brand-black text-brand-gold rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 border-4 border-brand-light">2</div>
              <h3 className="text-lg font-bold text-brand-black mb-2">حدد خطة التقسيط</h3>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm text-center border border-gray-100">
              <div className="w-12 h-12 bg-brand-black text-brand-gold rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 border-4 border-brand-light">3</div>
              <h3 className="text-lg font-bold text-brand-black mb-2">أرسل طلبك</h3>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm text-center border border-gray-100">
              <div className="w-12 h-12 bg-brand-gold text-brand-black rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 border-4 border-brand-light">4</div>
              <h3 className="text-lg font-bold text-brand-black mb-2">استلم هاتفك</h3>
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