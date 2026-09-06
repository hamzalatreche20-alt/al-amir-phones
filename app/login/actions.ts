'use server';
import { cookies } from 'next/headers';

export async function loginAdmin(password: string) {
  // جلب كلمة السر من ملف .env (أو استخدام الافتراضية إذا نسينا كتابتها)
  const expectedPassword = process.env.ADMIN_PASSWORD || 'amir2024';

  if (password === expectedPassword) {
    // إذا كانت صحيحة، نعطيه تصريح مرور صالح لمدة أسبوع
    const cookieStore = await cookies();
    cookieStore.set('admin_session', 'authenticated', { 
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // أسبوع
      path: '/',
    });
    return true;
  }
  
  return false; // كلمة السر خاطئة
}

// دالة لتسجيل الخروج
export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_session');
}