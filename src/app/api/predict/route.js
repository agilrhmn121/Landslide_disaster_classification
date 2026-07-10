import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { writeFile } from 'fs/promises';
import path from 'path';
import os from 'os';

export async function POST(request) {
  try {
    // 1. Tangkap file gambar dari web
    const data = await request.formData();
    const file = data.get('image');

    if (!file) {
      return NextResponse.json({ status: 'error', message: 'Tidak ada gambar yang diunggah.' }, { status: 400 });
    }

    // 2. Simpan gambar sementara ke folder Temp Windows
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uniqueFilename = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;
    const tempFilePath = path.join(os.tmpdir(), uniqueFilename);
    
    await writeFile(tempFilePath, buffer);

    // =========================================================================
    // 3. Path ke script Python (SUDAH DIPERBAIKI NAMA FOLDERNYA)
    // =========================================================================
    const pythonExecutable = 'python';
    // Alamat di bawah ini sudah disesuaikan dengan folder barumu!
    const scriptPath = 'D:\\Landslide_disaster_classification\\ml-backend\\app\\learn\\inference.py';
    
    // Susun perintah CMD
    const command = `${pythonExecutable} "${scriptPath}" --image "${tempFilePath}"`;

    // 4. Jalankan Python
    const runPython = () => {
      return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
          if (error) {
            // Trik baru: Cetak error asli dari Python ke terminal VS Code
            console.error("🚨 DETAIL ERROR PYTHON:", stderr); 
            reject(error);
          } else {
            resolve(stdout);
          }
        });
      });
    };

    const pythonOutput = await runPython();

    // 5. Bersihkan dan terjemahkan hasil JSON dari Python
    const cleanOutput = pythonOutput.trim();
    const resultJson = JSON.parse(cleanOutput);

    // Kirim hasilnya kembali ke layar pengguna
    return NextResponse.json(resultJson);

  } catch (error) {
    console.error("Error API Keseluruhan:", error);
    return NextResponse.json({ 
      status: 'error', 
      message: 'Gagal mengeksekusi Python. Pastikan script tidak error.' 
    }, { status: 500 });
  }
}