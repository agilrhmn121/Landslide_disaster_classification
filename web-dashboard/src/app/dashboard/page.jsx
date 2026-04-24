'use client'; 
import React, { useState } from 'react';
import { Layers, Brain, Upload, Loader2, AlertCircle, CheckCircle, ArrowLeft, ScanSearch, ImageOff, Zap, Clock, ShieldCheck, RefreshCcw } from 'lucide-react';

export default function DashboardPrediksiGanda() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setResult(null); 
    }
  };

  const handleBack = () => {
    const session = localStorage.getItem('user_session');
    if (session) {
      const userData = JSON.parse(session);
      if (userData.role === 'admin') {
        window.location.href = '/admin'; 
      } else {
        window.location.href = '/user'; 
      }
    } else {
      window.location.href = '/';
    }
  };

  const handlePredict = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await fetch('/api/predict', { 
        method: 'POST', 
        body: formData 
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ status: 'error', message: 'Gagal menghubungi server AI. Pastikan server Python berjalan.' });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreview(null);
    setResult(null);
  };

  const formatNamaBencana = (label) => {
    if (label === 'Drought') return 'Kekeringan (Drought)';
    if (label === 'Land_Slide') return 'Tanah Longsor (Land Slide)';
    if (label === 'human') return 'Gambar Manusia / Wajah';
    if (label === 'Non_Damage_Buildings_Street') return 'Bangunan / Jalanan Normal';
    if (label === 'Non_Damage_Wildlife_Forest') return 'Hutan / Alam Normal';
    return `Objek Lain (${label || 'Tidak Terdeteksi'})`;
  };

  // Patokan utama validasi kita adalah MobileNetV2
  const validDisasters = ['Drought', 'Land_Slide'];
  const isSuccess = result?.status === 'success';
  const predictedLabel = result?.mobilenet?.prediction;
  const isValidDisaster = isSuccess && validDisasters.includes(predictedLabel);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 py-10 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={handleBack} 
            className="p-3 bg-white rounded-full shadow-sm text-slate-500 hover:text-blue-600 transition-colors border border-slate-200"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              Komparasi AI: <span className="text-blue-600">MobileNetV2</span> vs <span className="text-purple-600">VGG16</span>
            </h1>
            <p className="text-slate-500 font-medium mt-1">Sistem deteksi bencana darat dengan evaluasi performa algoritma secara real-time.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Kolom Kiri: Upload Gambar */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <h2 className="font-bold text-xl mb-4 flex items-center gap-2 text-slate-700">
                <Upload size={20} className="text-blue-600" /> Input Gambar
              </h2>
              
              <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 flex flex-col items-center justify-center bg-slate-50 hover:bg-blue-50 transition-colors cursor-pointer relative min-h-[250px]">
                <input 
                  type="file" accept="image/*" onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                {preview ? (
                  <img src={preview} alt="Preview" className="max-h-56 rounded-xl shadow-md object-contain z-0 relative" />
                ) : (
                  <div className="text-center">
                    <div className="p-4 bg-white shadow-sm border border-slate-100 text-blue-600 rounded-full mx-auto w-16 h-16 flex items-center justify-center mb-3">
                      <Upload size={28} strokeWidth={2.5} />
                    </div>
                    <p className="font-bold text-slate-700">Pilih Foto Bencana</p>
                    <p className="text-xs font-medium text-slate-400 mt-1">Drought / Land Slide</p>
                  </div>
                )}
              </div>

              <button 
                onClick={handlePredict} disabled={!selectedFile || loading}
                className={`mt-6 w-full py-4 rounded-2xl font-black text-lg text-white flex items-center justify-center gap-2 transition-all ${
                  !selectedFile || loading ? 'bg-slate-300 cursor-not-allowed' : 'bg-slate-900 hover:bg-slate-800 shadow-lg transform hover:-translate-y-1'
                }`}
              >
                {loading ? <><Loader2 size={24} className="animate-spin" /> Menganalisis...</> : 'Jalankan Komparasi AI'}
              </button>
            </div>
          </div>

          {/* Kolom Kanan: Hasil Komparasi */}
          <div className="lg:col-span-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm h-full">
              <h2 className="font-bold text-xl mb-6 flex items-center gap-2 text-slate-700 border-b border-slate-100 pb-4">
                <Brain size={24} className="text-slate-900" /> Hasil Evaluasi Algoritma
              </h2>
              
              {/* STATE 1: KOSONG */}
              {!result && !loading && (
                <div className="h-[300px] flex flex-col items-center justify-center text-slate-400">
                  <ScanSearch size={64} className="mb-4 text-slate-200" strokeWidth={1} />
                  <span className="font-bold text-xl text-slate-500">Menunggu gambar input...</span>
                  <span className="font-medium text-sm mt-2 text-slate-400">Kedua model AI sedang bersiap (Standby).</span>
                </div>
              )}

              {/* STATE 2: LOADING */}
              {loading && (
                <div className="h-[300px] flex flex-col items-center justify-center text-blue-600 animate-pulse">
                  <Loader2 size={64} className="animate-spin mb-4" />
                  <span className="font-bold text-xl text-slate-700">AI Sedang Bertanding...</span>
                  <span className="font-medium text-sm mt-2 text-slate-500">Mengekstraksi fitur visual pada MobileNetV2 dan VGG16.</span>
                </div>
              )}

              {/* STATE 3A: BERHASIL & BENCANA VALID (TAMPILKAN 2 KARTU BERSEBELAHAN) */}
              {isSuccess && isValidDisaster && result.mobilenet && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in zoom-in duration-500">
                  
                  {/* KARTU 1: MOBILENET V2 */}
                  <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-200 rounded-3xl p-6 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-6">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-lg uppercase tracking-wide">
                        <Zap size={14} className="fill-blue-600"/> Algoritma 1
                      </div>
                      <span className="font-black text-xl text-blue-900">MobileNetV2</span>
                    </div>
                    
                    <div className="mb-6">
                      <p className="text-xs text-slate-500 font-bold mb-1 uppercase tracking-wider flex items-center gap-1"><ShieldCheck size={14}/> Prediksi Kelas:</p>
                      <p className="text-2xl font-black text-slate-800 leading-tight">{formatNamaBencana(result.mobilenet.prediction)}</p>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-xs font-bold text-slate-600 mb-2">
                          <span>Akurasi (Confidence)</span>
                          <span className="text-blue-700 font-black">{result.mobilenet.confidence_percentage}%</span>
                        </div>
                        <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${result.mobilenet.confidence_percentage}%` }}></div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-xs font-bold text-slate-600 bg-white p-3 rounded-xl border border-slate-100">
                        <span className="flex items-center gap-1"><Clock size={14} className="text-amber-500" /> Waktu Proses</span>
                        <span className="text-sm font-black text-slate-800">{result.mobilenet.waktu_eksekusi_ms} ms</span>
                      </div>
                    </div>
                  </div>

                  {/* KARTU 2: VGG16 */}
                  <div className="bg-gradient-to-br from-purple-50 to-white border border-purple-200 rounded-3xl p-6 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    {result.vgg16?.error ? (
                       <div className="h-full flex flex-col items-center justify-center text-center">
                          <AlertCircle size={40} className="text-purple-300 mb-3"/>
                          <p className="font-bold text-purple-800 text-sm">VGG16 Belum Tersedia</p>
                          <p className="text-xs text-purple-600 mt-1">{result.vgg16.error}</p>
                       </div>
                    ) : (
                      <>
                        <div className="flex justify-between items-start mb-6">
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-100 text-purple-700 text-xs font-bold rounded-lg uppercase tracking-wide">
                            <Layers size={14} className="fill-purple-600"/> Algoritma 2
                          </div>
                          <span className="font-black text-xl text-purple-900">VGG16</span>
                        </div>
                        
                        <div className="mb-6">
                          <p className="text-xs text-slate-500 font-bold mb-1 uppercase tracking-wider flex items-center gap-1"><ShieldCheck size={14}/> Prediksi Kelas:</p>
                          <p className="text-2xl font-black text-slate-800 leading-tight">{formatNamaBencana(result.vgg16?.prediction)}</p>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between text-xs font-bold text-slate-600 mb-2">
                              <span>Akurasi (Confidence)</span>
                              <span className="text-purple-700 font-black">{result.vgg16?.confidence_percentage}%</span>
                            </div>
                            <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
                              <div className="h-full bg-purple-500 rounded-full" style={{ width: `${result.vgg16?.confidence_percentage}%` }}></div>
                            </div>
                          </div>
                          <div className="flex justify-between items-center text-xs font-bold text-slate-600 bg-white p-3 rounded-xl border border-slate-100">
                            <span className="flex items-center gap-1"><Clock size={14} className="text-amber-500" /> Waktu Proses</span>
                            <span className="text-sm font-black text-slate-800">{result.vgg16?.waktu_eksekusi_ms} ms</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                </div>
              )}

              {/* STATE 3B: BUKAN BENCANA (TOLAK & UPLOAD ULANG) */}
              {isSuccess && !isValidDisaster && (
                <div className="flex flex-col items-center justify-center bg-orange-50 border-2 border-orange-200 rounded-3xl p-10 text-center animate-in fade-in zoom-in duration-500">
                  <ImageOff size={72} strokeWidth={1.5} className="text-orange-400 mb-5" />
                  <h3 className="text-2xl font-black text-orange-900 mb-3">Gambar Ditolak Sistem</h3>
                  <p className="text-orange-800 font-medium mb-8 max-w-md leading-relaxed text-sm">
                    AI mendeteksi gambar ini sebagai objek di luar kategori bencana:<br/>
                    <strong className="px-3 py-1.5 bg-orange-200 rounded-md inline-block mt-2 text-base shadow-sm">"{formatNamaBencana(predictedLabel)}"</strong><br/><br/>
                    Sistem ini hanya mengizinkan komparasi untuk gambar <strong>Kekeringan (Drought)</strong> atau <strong>Tanah Longsor (Land Slide)</strong>.
                  </p>
                  
                  <button 
                    onClick={handleReset}
                    className="flex items-center gap-2 px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl transition-all shadow-md transform hover:scale-105 active:scale-95"
                  >
                    <RefreshCcw size={20} strokeWidth={2.5} /> Upload Ulang Foto Bencana
                  </button>
                </div>
              )}

              {/* STATE 4: ERROR PYTHON KESELURUHAN */}
              {result && result.status === 'error' && (
                <div className="bg-red-50 border border-red-200 rounded-3xl p-8 flex flex-col justify-center items-center text-red-700 text-center h-[300px]">
                  <AlertCircle size={56} strokeWidth={2} className="mb-4 text-red-500" />
                  <h3 className="font-black text-xl mb-2 text-red-800">Terjadi Kesalahan Sistem</h3>
                  <p className="font-medium text-red-600 text-sm max-w-md">{result.message}</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}