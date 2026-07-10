import { NextResponse } from 'next/server';
import pool from '@/lib/db'; // Pastikan file db.js kamu ada di folder src/lib/

// Mengambil data user (GET)
export async function GET() {
  try {
    const [rows] = await pool.execute('SELECT id, name, username, role FROM users ORDER BY id DESC');
    return NextResponse.json({ status: 'success', data: rows });
  } catch (error) {
    console.error("Gagal mengambil data user:", error);
    return NextResponse.json({ status: 'error', message: 'Gagal menghubungi database.' }, { status: 500 });
  }
}

// Menghapus data user (DELETE)
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ status: 'error', message: 'ID User tidak valid.' }, { status: 400 });
    }

    const [result] = await pool.execute('DELETE FROM users WHERE id = ?', [id]);

    if (result.affectedRows > 0) {
      return NextResponse.json({ status: 'success', message: 'User berhasil dihapus' });
    } else {
      return NextResponse.json({ status: 'error', message: 'User tidak ditemukan' }, { status: 404 });
    }
  } catch (error) {
    console.error("Gagal menghapus user:", error);
    return NextResponse.json({ status: 'error', message: 'Terjadi kesalahan server.' }, { status: 500 });
  }
}