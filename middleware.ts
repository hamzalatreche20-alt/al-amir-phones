import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // إذا كان الرابط يبدأ بـ /admin
  if (pathname.startsWith('/admin')) {
    // نتحقق من وجود ملف تعريف ارتباط (Cookie) يثبت تسجيل الدخول
    const session = request.cookies.get('admin_session');
    
    // إذا لم يكن مسجلاً، نقوم بتحويله إلى صفحة تسجيل الدخول
    if (!session || session.value !== 'authenticated') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

// تحديد المسارات التي سيراقبها الجدار الناري
export const config = {
  matcher: ['/admin/:path*'],
};