import { NextResponse } from 'next/server';
import pool from '@/lib/db'; // Pastikan path ke db.js sudah benar

export async function POST(request) {
  try {
    const { name, username, password } = await request.json();

    // 1. Validasi input kosong
    if (!name || !username || !password) {
      return NextResponse.json({ status: 'error', message: 'Semua kolom harus diisi!' }, { status: 400 });
    }

    // 2. Cek apakah username sudah dipakai orang lain
    const [existingUsers] = await pool.execute(
      'SELECT id FROM users WHERE username = ?',
      [username]
    );

    if (existingUsers.length > 0) {
      return NextResponse.json({ status: 'error', message: 'Username sudah digunakan, pilih yang lain.' }, { status: 409 });
    }

    // 3. Simpan ke database (Secara default role-nya adalah 'user')
    // Catatan: Di aplikasi production sungguhan, password HARUS di-hash (misal pakai bcrypt).
    // Tapi untuk keperluan skripsi/belajar, teks biasa (plain text) bisa diterima.
    const [result] = await pool.execute(
      "INSERT INTO users (name, username, password, role) VALUES (?, ?, ?, 'user')",
      [name, username, password]
    );

    if (result.insertId) {
      return NextResponse.json({ 
        status: 'success', 
        message: 'Pendaftaran Berhasil! Silakan Login.'
      });
    } else {
      throw new Error('Gagal menyimpan ke database');
    }

  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json({ status: 'error', message: 'Terjadi kesalahan server.' }, { status: 500 });
  }
}