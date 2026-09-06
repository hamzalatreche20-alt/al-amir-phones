'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginAdmin } from './actions';

export default function Login() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const isSuccess = await loginAdmin(password);

    if (isSuccess) {
      // توجيه المدير إلى لوحة التحكم بعد نجاح الدخول
      router.push('/admin');
    } else {
      setError('كلمة المرور غير صحيحة، حاول مرة أخرى.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-light flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full p-8 rounded-3xl shadow-xl border border-gray-100 text-center relative overflow-hidden">
        {/* ديكور علوي */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/2 h-1 bg-brand-gold rounded-b-md"></div>
        
        <div className="w-20 h-20 bg-brand-black text-brand-gold rounded-full flex items-center justify-center text-3xl mx-auto mb-6 shadow-lg border-4 border-white">
          🔒
        </div>
        
        <h1 className="text-2xl font-bold text-brand-black mb-2">تسجيل الدخول</h1>
        <p className="text-gray-500 text-sm mb-8">الرجاء إدخال كلمة المرور للوصول إلى لوحة التحكم الخاصة بمحل الأمير.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full text-center tracking-[0.3em] font-bold text-lg border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-brand-gold focus:border-brand-gold bg-gray-50"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm font-bold">{error}</p>}

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full py-4 rounded-xl font-bold text-lg text-white transition ${loading ? 'bg-gray-400' : 'bg-brand-black hover:bg-gray-800'}`}
          >
            {loading ? 'جاري التحقق...' : 'دخول للوحة التحكم'}
          </button>
        </form>

        <a href="/" className="block mt-6 text-sm text-gray-400 hover:text-brand-black transition">
          ← العودة للمتجر
        </a>
      </div>
    </div>
  );
}