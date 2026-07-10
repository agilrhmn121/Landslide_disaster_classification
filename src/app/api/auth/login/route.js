import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    // Cari user di database MySQL
    const [rows] = await pool.execute(
      'SELECT id, name, username, role FROM users WHERE username = ? AND password = ?',
      [username, password]
    );

    // Jika user ditemukan
    if (rows.length > 0) {
      const user = rows[0];
      return NextResponse.json({ 
        status: 'success', 
        message: 'Login Berhasil',
        data: { name: user.name, username: user.username, role: user.role }
      });
    } else {
      // Jika salah password/username
      return NextResponse.json({ 
        status: 'error', 
        message: 'Username atau Password salah!' 
      }, { status: 401 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ status: 'error', message: 'Terjadi kesalahan server' }, { status: 500 });
  }
}
