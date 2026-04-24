'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, LogOut, AlertCircle } from 'lucide-react';

export default function UserDashboard() {
  const [user, setUser] = useState(null);
  const [sessionError, setSessionError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Menambahkan try-catch agar web tidak crash jika sesi bermasalah
    try {
      const session = localStorage.getItem('user_session');
      
      // Jika tidak ada data login sama sekali
      if (!session) {
        router.push('/'); 
        return;
      }
      
      const userData = JSON.parse(session);
      
      // Mencegah Admin masuk ke halaman User Biasa
      if (userData?.role === 'admin') {
        router.push('/admin'); 
        return;
      }

      // Pastikan data yang dibaca itu benar-benar ada nama dan rolenya
      if (userData && userData.name) {
        setUser(userData);
      } else {
        throw new Error("Data sesi tidak lengkap");
      }

    } catch (error) {
      console.error("Error membaca sesi:", error);
      setSessionError(true);
      // Hapus sesi yang rusak dan kembalikan ke halaman login
      localStorage.removeItem('user_session');
      setTimeout(() => {
        router.push('/');
      }, 3000);
    }
  }, [router]);

  // Fungsi Logout
  const handleLogout = () => {
    localStorage.removeItem('user_session');
    router.push('/');
  };

  // Tampilan jika Sesi Rusak
  if (sessionError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center font-medium text-red-600 bg-red-50 p-6">
        <AlertCircle size={48} className="mb-4 text-red-500" />
        <h2 className="text-xl font-bold mb-2">Sesi Tidak Valid / Rusak</h2>
        <p>Sistem akan mengarahkan Anda kembali ke halaman login dalam 3 detik...</p>
      </div>
    );
  }

  // Tampilan Saat Loading (Sebelum nama User muncul)
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center font-bold text-gray-500 bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          Memuat Dashboard User...
        </div>
      </div>
    );
  }

  // Tampilan UTAMA Dashboard User
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800">
      {/* Navbar User */}
      <header className="bg-white shadow-sm px-4 sm:px-8 py-4 flex justify-between items-center border-b border-gray-200">
        <div className="font-black text-2xl text-blue-700 tracking-tight">Disaster Classify</div>
        <div className="flex items-center gap-4">
          <span className="font-bold text-gray-700 hidden sm:inline">Halo, {user.name}</span>
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 hover:text-red-800 rounded-xl font-bold text-sm transition-colors"
          >
            <LogOut size={16} strokeWidth={2.5} /> Logout
          </button>
        </div>
      </header>

      {/* Konten User */}
      <div className="flex-1 p-6 sm:p-10 max-w-5xl mx-auto w-full">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-8 rounded-3xl shadow-xl shadow-blue-600/20 mb-10 relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-3xl font-black mb-2">Pendeteksi Bencana AI 🚨</h1>
            <p className="text-blue-100 font-medium text-lg">Silakan gunakan layanan AI kami untuk mendeteksi Kekeringan (Drought) atau Tanah Longsor (Land Slide) dari gambar.</p>
          </div>
          {/* Ornamen background */}
          <div className="absolute right-0 top-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
        </div>
        
        <h2 className="text-xl font-bold text-gray-800 mb-6">Menu Utama</h2>
        
        {/* Tombol ke halaman Komparasi/Prediksi */}
        <button 
          onClick={() => router.push('/dashboard')}
          className="flex flex-col items-center justify-center p-8 bg-white border border-gray-200 hover:border-blue-500 rounded-3xl shadow-sm hover:shadow-xl transition-all w-full sm:w-72 group relative overflow-hidden"
        >
          <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
            <Camera size={40} strokeWidth={2} />
          </div>
          <h3 className="font-black text-2xl text-gray-800 mb-1">Mulai Prediksi</h3>
          <p className="text-sm font-medium text-gray-500">Uji coba komparasi AI sekarang</p>
        </button>
      </div>
    </div>
  );
}