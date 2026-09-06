import type { Metadata } from 'next'
import './globals.css'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'محل الأمير لبيع الهواتف بالتقسيط',
  description: 'أحدث الهواتف الذكية بأسعار مناسبة وخيارات تقسيط مرنة تناسب احتياجاتك.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl" className="scroll-smooth">
      <body className="flex flex-col min-h-screen">
        
        {/* Navigation Bar */}
        <header className="bg-brand-black text-white sticky top-0 z-50 shadow-md">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="flex flex-col">
              <span className="text-xl md:text-2xl font-bold text-brand-gold">محل الأمير</span>
              <span className="text-xs text-gray-300">لبيع الهواتف بالتقسيط</span>
            </Link>
            
            <nav className="hidden md:flex gap-6 text-sm font-medium">
              <Link href="/" className="hover:text-brand-gold transition">الرئيسية</Link>
              <Link href="#phones" className="hover:text-brand-gold transition">الهواتف</Link>
              <Link href="#calculator" className="hover:text-brand-gold transition">حاسبة التقسيط</Link>
              <Link href="#faq" className="hover:text-brand-gold transition">الأسئلة الشائعة</Link>
            <Link href="/" className="font-bold text-brand-black hover:text-brand-gold">التقسيط</Link>
  <Link href="/store" className="font-bold text-gray-600 hover:text-green-600">المتجر (كاش) 💵</Link>
            </nav>

            <Link href="#phones" className="bg-brand-gold text-brand-black px-4 py-2 rounded-lg font-bold text-sm hover:bg-yellow-500 transition">
              تصفح الهواتف
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow">
          {children}
        </main>

       {/* Footer الاحترافي */}
        <footer className="bg-brand-black text-white pt-16 pb-8 border-t-4 border-brand-gold mt-auto">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              
              {/* معلومات المتجر */}
              <div>
                <Link href="/" className="flex flex-col mb-4">
                  <span className="text-2xl font-bold text-brand-gold">محل الأمير</span>
                  <span className="text-sm text-gray-400">لبيع الهواتف بالتقسيط</span>
                </Link>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  وجهتك الأولى في الجزائر لامتلاك أحدث الهواتف الذكية بخطط دفع مرنة وميسرة تتناسب مع ميزانيتك. مصداقية، سرعة، وضمان.
                </p>
              </div>

              {/* روابط سريعة */}
              <div>
                <h3 className="text-lg font-bold mb-4 text-white relative inline-block">
                  روابط سريعة
                  <span className="absolute -bottom-1 right-0 w-1/2 h-1 bg-brand-gold rounded-full"></span>
                </h3>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li><Link href="/" className="hover:text-brand-gold transition">الرئيسية</Link></li>
                  <li><Link href="#phones" className="hover:text-brand-gold transition">تصفح الهواتف</Link></li>
                  <li><Link href="#calculator" className="hover:text-brand-gold transition">حاسبة التقسيط</Link></li>
                  <li><Link href="#how-it-works" className="hover:text-brand-gold transition">كيف يعمل التقسيط؟</Link></li>
                  <li><Link href="#faq" className="hover:text-brand-gold transition">الأسئلة الشائعة</Link></li>
                </ul>
              </div>

              {/* تواصل معنا */}
              <div>
                <h3 className="text-lg font-bold mb-4 text-white relative inline-block">
                  تواصل معنا
                  <span className="absolute -bottom-1 right-0 w-1/2 h-1 bg-brand-gold rounded-full"></span>
                </h3>
                <ul className="space-y-3 text-gray-400 text-sm">
                  <li className="flex items-center gap-2">
                    <span>📍</span> العنوان: شارع ديدوش مراد، الجزائر العاصمة
                  </li>
                  <li className="flex items-center gap-2">
                    <span>📞</span> الهاتف: <span dir="ltr">0555 00 00 00</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>💬</span> واتساب: <span dir="ltr">0555 00 00 00</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>🕒</span> أوقات العمل: السبت - الخميس (9ص - 6م)
                  </li>
                </ul>
              </div>

              {/* شبكات التواصل */}
              <div>
                <h3 className="text-lg font-bold mb-4 text-white relative inline-block">
                  تابعنا على
                  <span className="absolute -bottom-1 right-0 w-1/2 h-1 bg-brand-gold rounded-full"></span>
                </h3>
                <div className="flex gap-4">
                  {/* Facebook Icon */}
                  <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-brand-blue hover:text-white transition">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/></svg>
                  </a>
                  {/* Instagram/TikTok Icon Placeholder */}
                  <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-pink-600 hover:text-white transition">
                    <span className="font-bold text-sm">IG</span>
                  </a>
                </div>
              </div>

            </div>
            
            <div className="border-t border-gray-800 pt-6 text-center text-sm text-gray-500">
              <p>© {new Date().getFullYear()} محل الأمير لبيع الهواتف بالتقسيط. جميع الحقوق محفوظة.</p>
              <p className="mt-2 text-xs">صُنع لتقديم أفضل تجربة تسوق في الجزائر 🇩🇿</p>
            </div>
          </div>
        </footer>
        {/* Floating WhatsApp Button */}
        <a 
          href="https://wa.me/213000000000?text=السلام عليكم، أريد الاستفسار عن الهواتف المتوفرة بالتقسيط" 
          target="_blank" 
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-xl hover:bg-green-600 transition hover:scale-110 z-50 flex items-center justify-center"
        >
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51h-.573c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </a>
      </body>
    </html>
  )
}