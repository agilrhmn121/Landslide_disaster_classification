'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, Lock, User } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (data.status === 'success') {
        localStorage.setItem('user_session', JSON.stringify(data.data));
        
        if (data.data.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/user');
        }
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Gagal menghubungi server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-xl mx-auto flex items-center justify-center text-white font-bold text-2xl mb-4">D</div>
          {/* Judul lebih tebal (font-black) */}
          <h1 className="text-3xl font-black text-gray-900">Disaster Classify</h1>
          <p className="text-gray-600 font-medium text-sm mt-2">Silakan login untuk melanjutkan</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg flex items-center gap-2 text-sm font-semibold">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            {/* Label Username Ditebalkan (font-bold text-gray-900) */}
            <label className="block text-sm font-bold text-gray-900 mb-1">Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                <User size={18} strokeWidth={2.5} />
              </div>
              {/* Input teks ditebalkan (font-semibold text-gray-900) */}
              <input 
                type="text" required
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none font-semibold text-gray-900 placeholder:font-medium placeholder:text-gray-400"
                placeholder="Masukkan username"
                value={username} onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div>
            {/* Label Password Ditebalkan (font-bold text-gray-900) */}
            <label className="block text-sm font-bold text-gray-900 mb-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                <Lock size={18} strokeWidth={2.5} />
              </div>
              {/* Input teks ditebalkan (font-semibold text-gray-900) */}
              <input 
                type="password" required
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none font-semibold text-gray-900 placeholder:font-medium placeholder:text-gray-400"
                placeholder="••••••••"
                value={password} onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit" disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-lg py-3 rounded-xl transition-colors tracking-wide"
          >
            {loading ? 'Memeriksa...' : 'Login Sekarang'}
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm font-medium text-gray-700 border-t pt-4">
          Belum punya akun?{' '}
          <button 
            type="button"
            onClick={() => router.push('/register')}
            className="text-blue-700 hover:text-blue-900 font-black hover:underline"
          >
            Daftar di sini
          </button>
        </div>

      </div>
    </div>
  );
}