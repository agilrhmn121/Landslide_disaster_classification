'use client';
import { useState } from 'react';
// import { useRouter } from 'next/navigation';
import { AlertCircle, Lock, User, UserPlus, CheckCircle, CreditCard } from 'lucide-react';

// Pengganti fungsi navigasi khusus untuk lingkungan pratinjau (preview) ini
const useRouter = () => ({
  push: (url) => {
    window.location.href = url;
  }
});

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, username, password })
      });

      const data = await res.json();

      if (data.status === 'success') {
        setSuccessMsg(data.message);
        // Kosongkan form setelah sukses
        setName('');
        setUsername('');
        setPassword('');
        
        // Arahkan ke halaman login setelah 2 detik
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Gagal menghubungi server pendaftaran.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-slate-800">
      <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 w-full max-w-md relative overflow-hidden">
        
        {/* Ornamen Background */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full opacity-50 -z-10"></div>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center text-white font-bold text-2xl mb-5 shadow-lg shadow-blue-500/30">
            <UserPlus size={32} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Buat Akun Baru</h1>
          <p className="text-slate-500 font-medium mt-2">Daftar untuk menggunakan layanan AI Bencana</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-start gap-3 text-sm font-medium">
            <AlertCircle size={20} className="flex-shrink-0 mt-0.5 text-red-500" /> 
            <p>{error}</p>
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl flex items-start gap-3 text-sm font-bold">
            <CheckCircle size={20} className="flex-shrink-0 mt-0.5 text-green-500" /> 
            <p>{successMsg}</p>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-sm font-black text-slate-800 mb-2 uppercase tracking-wide">Nama Lengkap</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <CreditCard size={18} />
              </div>
              <input 
                type="text" required
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 text-slate-800 font-bold rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all placeholder:font-medium placeholder:text-slate-400"
                placeholder="Misal: Budi Santoso"
                value={name} onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-black text-slate-800 mb-2 uppercase tracking-wide">Username Pilihan</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <User size={18} />
              </div>
              <input 
                type="text" required
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 text-slate-800 font-bold rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all placeholder:font-medium placeholder:text-slate-400"
                placeholder="Buat username unik (tanpa spasi)"
                value={username} onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-black text-slate-800 mb-2 uppercase tracking-wide">Password (Kata Sandi)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Lock size={18} />
              </div>
              <input 
                type="password" required minLength="5"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 text-slate-800 font-bold rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all placeholder:font-medium placeholder:text-slate-400"
                placeholder="Minimal 5 karakter"
                value={password} onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit" disabled={loading || successMsg}
            className={`w-full text-white font-black text-lg py-4 rounded-xl transition-all mt-4 flex justify-center items-center gap-2 ${
              loading || successMsg 
              ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none' 
              : 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30 transform active:scale-[0.98]'
            }`}
          >
            {loading ? 'Memproses Pendaftaran...' : 'Daftar Sekarang'}
          </button>
        </form>
        
        <div className="mt-8 text-center text-sm font-medium text-slate-500 border-t border-slate-100 pt-6">
          Sudah punya akun?{' '}
          <button 
            type="button"
            onClick={() => router.push('/')}
            className="text-blue-600 hover:text-blue-800 font-black hover:underline transition-colors ml-1"
          >
            Login di sini
          </button>
        </div>
      </div>
    </div>
  );
}