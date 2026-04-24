import mysql from 'mysql2/promise';

// Membuat koneksi ke MySQL Laragon
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root', // Default Laragon
  password: '', // Default Laragon (kosong)
  database: 'disaster_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;