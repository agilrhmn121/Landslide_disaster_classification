'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Database,
  BrainCircuit,
  ScanSearch,
  LogOut,
  Trash2,
  Shield,
  User as UserIcon,
  Loader2,
  AlertCircle
} from 'lucide-react';

export default function ManajemenUser() {

  const router = useRouter();

  const [adminData, setAdminData] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // ==============================
  // CEK SESSION ADMIN
  // ==============================
  useEffect(() => {

    const session = localStorage.getItem('user_session');

    if (!session) {
      router.push('/');
      return;
    }

    try {

      const userData = JSON.parse(session);

      if (userData.role !== 'admin') {
        router.push('/user');
        return;
      }

      setAdminData(userData);
      fetchUsers();

    } catch {
      router.push('/');
    }

  }, []);


  // ==============================
  // FETCH USER DARI API
  // ==============================
  const fetchUsers = async () => {

    setLoading(true);
    setErrorMsg('');

    try {

      const res = await fetch('/api/users');

      if (!res.ok) {
        throw new Error('API tidak merespon.');
      }

      const json = await res.json();

      if (json.status === 'success') {
        setUsersList(json.data);
      } else {
        throw new Error(json.message);
      }

    } catch (err) {

      console.error(err);
      setErrorMsg(err.message);

    } finally {
      setLoading(false);
    }
  };


  // ==============================
  // HAPUS USER
  // ==============================
  const handleDelete = async (id, name) => {

    const confirmDelete = confirm(
      `Apakah Anda yakin ingin menghapus user "${name}" ?`
    );

    if (!confirmDelete) return;

    try {

      const res = await fetch(`/api/users?id=${id}`, {
        method: 'DELETE'
      });

      const json = await res.json();

      if (json.status === 'success') {

        alert('User berhasil dihapus');
        fetchUsers();

      } else {

        alert(json.message);

      }

    } catch {

      alert('Terjadi kesalahan saat menghapus user');

    }
  };


  // ==============================
  // LOGOUT
  // ==============================
  const handleLogout = () => {

    localStorage.removeItem('user_session');
    router.push('/');

  };


  if (!adminData) return null;


  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* ================= SIDEBAR ================= */}

      <div className="w-72 bg-slate-900 text-white p-6 flex flex-col">

        <h2 className="text-2xl font-black mb-10">Admin Panel</h2>

        <nav className="flex-1 space-y-2">

          <button
            onClick={() => router.push('/admin')}
            className="w-full flex items-center gap-3 p-4 hover:bg-slate-800 rounded-xl"
          >
            <LayoutDashboard size={20} />
            Dashboard
          </button>

          <button className="w-full flex items-center gap-3 p-4 bg-blue-600/20 text-blue-400 rounded-xl font-bold">
            <Users size={20} />
            Manajemen User
          </button>

          <button className="w-full flex items-center gap-3 p-4 hover:bg-slate-800 rounded-xl">
            <Database size={20} />
            Dataset
          </button>

          <button className="w-full flex items-center gap-3 p-4 hover:bg-slate-800 rounded-xl">
            <BrainCircuit size={20} />
            Training AI
          </button>

          <button
            onClick={() => router.push('/dashboard')}
            className="w-full flex items-center gap-3 p-4 hover:bg-green-500/10 text-green-400 rounded-xl"
          >
            <ScanSearch size={20} />
            Coba Prediksi
          </button>

        </nav>

        <button
          onClick={handleLogout}
          className="mt-auto flex items-center justify-center gap-2 p-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl"
        >
          <LogOut size={20} />
          Logout
        </button>

      </div>


      {/* ================= CONTENT ================= */}

      <div className="flex-1 p-10">

  <h1 className="text-4xl font-extrabold text-slate-900 mb-2">
    Manajemen Pengguna
  </h1>

  <p className="text-lg font-semibold text-slate-600 mb-6">
    Kelola seluruh akun pengguna yang memiliki akses ke sistem.
  </p>

  {/* ERROR MESSAGE */}

  {errorMsg && (

    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-2 font-semibold">
      <AlertCircle size={20} />
      {errorMsg}
    </div>

  )}


        {/* TABLE */}

        <div className="bg-white rounded-2xl border overflow-hidden">

          {loading ? (

            <div className="p-20 flex flex-col items-center gap-3">

              <Loader2 className="animate-spin" size={40} />

              <span>Memuat data user...</span>

            </div>

          ) : (

           <table className="w-full text-[15px]">

  <thead className="bg-slate-100 text-slate-700 font-extrabold uppercase">
    <tr>
      <th className="p-4 font-bold">ID</th>
      <th className="p-4 font-bold">Nama</th>
      <th className="p-4 font-bold">Username</th>
      <th className="p-4 font-bold">Role</th>
      <th className="p-4 text-center font-bold">Aksi</th>
    </tr>
  </thead>

  <tbody>

    {usersList.map((usr) => (

      <tr key={usr.id} className="border-t hover:bg-slate-50">

        <td className="p-4 font-semibold text-slate-700">
          {usr.id}
        </td>

        <td className="p-4 font-bold text-slate-900">
          {usr.name}
        </td>

        <td className="p-4 font-semibold text-slate-700">
          @{usr.username}
        </td>

        <td className="p-4">

          {usr.role === 'admin' ? (

            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-lg flex items-center gap-1 w-fit font-semibold">
              <Shield size={14} />
              Admin
            </span>

          ) : (

            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg flex items-center gap-1 w-fit font-semibold">
              <UserIcon size={14} />
              User
            </span>

          )}

        </td>

        <td className="p-4 text-center">

          <button
            onClick={() => handleDelete(usr.id, usr.name)}
            disabled={usr.username === adminData.username}
            className="bg-red-100 hover:bg-red-600 hover:text-white p-2 rounded-lg transition font-bold"
          >
            <Trash2 size={18} />
          </button>

        </td>

      </tr>

    ))}

  </tbody>

</table>

          )}

        </div>

      </div>

    </div>
  );
}