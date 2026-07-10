'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, Users, Database, BrainCircuit, ScanSearch, LogOut, Activity, Zap, Cpu, Server, ShieldCheck, ArrowRight, CheckCircle } from 'lucide-react';

export default function AdminDashboard() {
  const [adminData, setAdminData] = useState(null);
  const router = useRouter();

  // Cek Sesi Admin
  useEffect(() => {
    const session = localStorage.getItem('user_session');
    if (!session) {
      router.push('/'); return;
    }
    const userData = JSON.parse(session);
    if (userData?.role !== 'admin') {
      router.push('/user'); return;
    }
    setAdminData(userData);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user_session');
    router.push('/');
  };

  if (!adminData) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans text-slate-800">
      
      {/* Sidebar Admin (Sama persis dengan halaman User agar nyambung) */}
      <div className="w-72 bg-slate-900 text-white p-6 flex flex-col shadow-xl z-10">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-xl shadow-lg shadow-blue-500/30">D</div>
          <h2 className="text-2xl font-black text-white tracking-tight">Admin Panel</h2>
        </div>

        <nav className="flex-1 space-y-2">
          {/* Menu Aktif */}
          <button className="w-full flex items-center gap-3 p-4 bg-blue-600/20 text-blue-400 rounded-xl font-bold transition-all">
            <LayoutDashboard size={20} /> Dashboard Utama
          </button>
          
          <button onClick={() => router.push('/admin/users')} className="w-full flex items-center gap-3 p-4 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl font-semibold transition-colors">
            <Users size={20} /> Manajemen User
          </button>
          
          <button className="w-full flex items-center gap-3 p-4 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl font-semibold transition-colors">
            <Database size={20} /> Dataset Bencana
          </button>
          
          <button className="w-full flex items-center gap-3 p-4 hover:bg-slate-800 text-yellow-400 hover:bg-yellow-400/10 rounded-xl font-bold transition-colors">
            <BrainCircuit size={20} /> Training Model AI
          </button>
          
          <button onClick={() => router.push('/dashboard')} className="w-full flex items-center gap-3 p-4 hover:bg-green-500/10 text-green-400 rounded-xl font-bold transition-colors mt-4 border border-green-500/20">
            <ScanSearch size={20} /> Coba Prediksi AI
          </button>
        </nav>

        <button onClick={handleLogout} className="mt-auto flex items-center justify-center gap-2 p-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl font-bold transition-colors">
          <LogOut size={20} /> Logout System
        </button>
      </div>

      {/* Konten Utama Dashboard */}
      <div className="flex-1 p-10 bg-slate-50 overflow-auto">
        
        {/* Header Welcome */}
        <div className="mb-10 flex justify-between items-center bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-3xl font-black text-slate-800 mb-2">
              Selamat datang, <span className="text-blue-600 capitalize">{adminData.name}</span>! 👋
            </h1>
            <p className="text-slate-500 font-medium text-lg">
              Pusat Kendali Sistem Deteksi Bencana Daratan (Land Disaster) berbasis Deep Learning.
            </p>
          </div>
          <div className="hidden lg:block relative z-10">
             <div className="flex gap-4">
                <div className="px-5 py-3 bg-blue-50 text-blue-700 rounded-xl font-bold flex items-center gap-2 border border-blue-100">
                  <ShieldCheck size={20} /> System Online
                </div>
             </div>
          </div>
          {/* Ornamen Background */}
          <div className="absolute right-0 top-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/4"></div>
        </div>

        {/* Ringkasan Statistik */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl"><Database size={24} /></div>
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-lg">+12%</span>
            </div>
            <div>
              <p className="text-slate-500 font-bold text-sm uppercase tracking-wider mb-1">Total Dataset</p>
              <p className="text-3xl font-black text-slate-800">1,240 <span className="text-sm font-medium text-slate-400">Gambar</span></p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl"><Activity size={24} /></div>
            </div>
            <div>
              <p className="text-slate-500 font-bold text-sm uppercase tracking-wider mb-1">Kategori (Kelas)</p>
              <p className="text-3xl font-black text-slate-800">5 <span className="text-sm font-medium text-slate-400">Fokus Darat</span></p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl"><BrainCircuit size={24} /></div>
            </div>
            <div>
              <p className="text-slate-500 font-bold text-sm uppercase tracking-wider mb-1">Model Aktif</p>
              <p className="text-3xl font-black text-slate-800">1 <span className="text-sm font-medium text-slate-400">Arsitektur</span></p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl"><Users size={24} /></div>
            </div>
            <div>
              <p className="text-slate-500 font-bold text-sm uppercase tracking-wider mb-1">Total Pengguna</p>
              <p className="text-3xl font-black text-slate-800">Admin & User</p>
            </div>
          </div>
        </div>

        {/* Informasi Model AI (MobileNet vs VGG16) */}
        <h2 className="text-2xl font-black text-slate-800 mb-6">Status Mesin Kecerdasan Buatan</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Card MobileNetV2 */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 transition-opacity group-hover:opacity-10"><Zap size={120} /></div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/40">
                <Cpu size={28} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-800">MobileNetV2</h3>
                <p className="text-blue-600 font-bold text-sm">Model Utama (High Speed)</p>
              </div>
            </div>
            <p className="text-slate-600 font-medium mb-6 leading-relaxed">
              Arsitektur ringan buatan Google. Dioptimalkan untuk kecepatan komputasi dan sangat efisien untuk dijalankan pada aplikasi berbasis Web.
            </p>
            <div className="space-y-4">
               <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <span className="text-slate-500 font-bold">Status File (.h5)</span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-bold flex items-center gap-1"><CheckCircle size={14}/> Ready</span>
               </div>
               <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <span className="text-slate-500 font-bold">Keunggulan</span>
                  <span className="text-slate-800 font-bold">Kecepatan Inferensi (ms)</span>
               </div>
            </div>
          </div>

          

        </div>

        {/* Call to Action: Coba Prediksi */}
        <div className="mt-8 bg-slate-900 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between shadow-xl">
           <div>
              <h3 className="text-2xl font-black text-white mb-2">Siap Melakukan Pengujian?</h3>
              <p className="text-slate-400 font-medium">Buka halaman prediksi untuk membandingkan performa kedua model secara langsung (Side-by-Side).</p>
           </div>
           <button 
              onClick={() => router.push('/dashboard')}
              className="mt-6 md:mt-0 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl flex items-center gap-3 transition-colors"
            >
              Uji Coba AI Sekarang <ArrowRight size={20} />
           </button>
        </div>

      </div>
    </div>
  );
}