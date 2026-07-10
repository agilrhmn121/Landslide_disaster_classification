'use client'; 
import React, { useState } from 'react';
import { Upload, Loader2, ArrowLeft, ImageOff, RefreshCcw, AlertCircle } from 'lucide-react';

// ==========================================
// KOMPONEN: Grafik Melingkar (Circular Progress)
// ==========================================
const CircularProgress = ({ percentage, colorStr }) => {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  return (
    <div className="relative inline-flex items-center justify-center mb-4">
      <svg className="w-28 h-28 transform -rotate-90">
        <circle 
          cx="56" cy="56" r={radius} 
          stroke="#F3F4F6" strokeWidth="8" fill="transparent" 
        />
        <circle 
          cx="56" cy="56" r={radius} 
          stroke={colorStr} strokeWidth="8" fill="transparent" 
          strokeDasharray={circumference} 
          strokeDashoffset={strokeDashoffset} 
          className="transition-all duration-1000 ease-out" 
          strokeLinecap="round" 
        />
      </svg>
      <span className="absolute text-xl font-black text-slate-800">{percentage}%</span>
    </div>
  );
};

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
      setResult({ status: 'error', message: 'Gagal menghubungi server AI. Pastikan server berjalan.' });
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
    if (label === 'Drought') return 'Kekeringan';
    if (label === 'Land_Slide') return 'Tanah Longsor';
    if (label === 'human') return 'Gambar Manusia';
    if (label === 'Non_Damage_Buildings_Street') return 'Bangunan Normal';
    if (label === 'Non_Damage_Wildlife_Forest') return 'Hutan Normal';
    return label || 'Tidak Terdeteksi';
  };

  const validDisasters = ['Drought', 'Land_Slide'];
  const isSuccess = result?.status === 'success';
  const predictedLabel = result?.mobilenet?.prediction;
  const isValidDisaster = isSuccess && validDisasters.includes(predictedLabel);

  return (
    // Background #FAFAFA
    <div className="min-h-screen bg-[#FAFAFA] font-sans text-slate-800 py-12 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Tombol Kembali */}
        <button 
          onClick={handleBack} 
          className="mb-8 flex items-center gap-2 text-[#8D6E63] hover:text-[#2E7D32] font-medium transition-colors"
        >
          <ArrowLeft size={20} /> Kembali ke Beranda
        </button>

        {/* ==========================================
            SECTION 1: UPLOAD (COBA BENCANA AI)
            ========================================== */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-[#2E7D32] mb-2">Coba Bencana AI</h1>
          <p className="text-[#8D6E63] font-medium">Unggah foto lanskap untuk dianalisis oleh sistem.</p>
        </div>

        <div className="bg-[#FFFFFF] p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100 max-w-3xl mx-auto mb-16 text-center">
          
          <div className="border-2 border-dashed border-[#81C784] rounded-xl p-8 mb-8 relative flex flex-col items-center justify-center min-h-[250px] bg-slate-50 hover:bg-[#FAFAFA] transition-colors cursor-pointer">
            <input 
              type="file" accept="image/*" onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            {preview ? (
              <img src={preview} alt="Preview" className="max-h-64 rounded-lg shadow-sm object-contain z-0 relative" />
            ) : (
              <div className="text-center pointer-events-none">
                <Upload size={40} className="text-[#81C784] mx-auto mb-4" />
                <p className="font-bold text-slate-700 text-lg">Upload gambar lanskap...</p>
                <p className="text-sm font-medium text-[#8D6E63] mt-2">Drag-and-drop atau klik untuk memilih file.</p>
              </div>
            )}
          </div>

          <button 
            onClick={handlePredict} disabled={!selectedFile || loading}
            className={`px-10 py-4 rounded-full font-bold text-lg text-white transition-all w-full md:w-auto inline-flex items-center justify-center gap-2 ${
              !selectedFile || loading ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#2E7D32] hover:bg-[#1b5e20] shadow-md transform hover:-translate-y-1'
            }`}
          >
            {loading ? <><Loader2 size={24} className="animate-spin" /> Menganalisis...</> : 'Analisis Risiko Sekarang'}
          </button>
        </div>

        {/* ==========================================
            SECTION 2: HASIL EVALUASI MODEL
            ========================================== */}
        {(loading || result) && (
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[#2E7D32] mb-2">Evaluasi Model</h2>
            <p className="text-[#8D6E63] font-medium border-b border-gray-200 pb-8 max-w-2xl mx-auto">Perbandingan performa tiga arsitektur AI secara real-time.</p>
          </div>
        )}

        {/* STATE: LOADING */}
        {loading && (
          <div className="flex justify-center items-center py-10">
            <Loader2 size={48} className="animate-spin text-[#81C784]" />
          </div>
        )}

        {/* STATE: BERHASIL (TAMPILKAN 3 MODEL) */}
        {isSuccess && isValidDisaster && result.mobilenet && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* MobileNetV2 */}
            <div className="bg-[#FFFFFF] p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <h3 className="font-bold text-xl text-slate-800 mb-6">MobileNetV2</h3>
              <CircularProgress percentage={result.mobilenet.confidence_percentage} colorStr="#2E7D32" />
              <div className="mt-4">
                <p className="text-[#8D6E63] text-sm font-bold uppercase tracking-wider mb-1">Prediksi</p>
                <p className="font-bold text-lg text-slate-800 mb-4">{formatNamaBencana(result.mobilenet.prediction)}</p>
                <div className="bg-[#FAFAFA] px-4 py-2 rounded-lg inline-block border border-gray-100">
                  <p className="text-xs text-[#8D6E63] font-bold uppercase mb-1">Waktu Inferensi</p>
                  <p className="font-black text-[#2E7D32]">{result.mobilenet.waktu_eksekusi_ms} ms</p>
                </div>
              </div>
            </div>

            {/* ResNet50 */}
            <div className="bg-[#FFFFFF] p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <h3 className="font-bold text-xl text-slate-800 mb-6">ResNet50</h3>
              {result.resnet50?.error ? (
                <p className="text-sm text-red-500 py-10">{result.resnet50.error}</p>
              ) : (
                <>
                  <CircularProgress percentage={result.resnet50?.confidence_percentage} colorStr="#8D6E63" />
                  <div className="mt-4">
                    <p className="text-[#8D6E63] text-sm font-bold uppercase tracking-wider mb-1">Prediksi</p>
                    <p className="font-bold text-lg text-slate-800 mb-4">{formatNamaBencana(result.resnet50?.prediction)}</p>
                    <div className="bg-[#FAFAFA] px-4 py-2 rounded-lg inline-block border border-gray-100">
                      <p className="text-xs text-[#8D6E63] font-bold uppercase mb-1">Waktu Inferensi</p>
                      <p className="font-black text-[#8D6E63]">{result.resnet50?.waktu_eksekusi_ms} ms</p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* VGG16 */}
            <div className="bg-[#FFFFFF] p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <h3 className="font-bold text-xl text-slate-800 mb-6">VGG16</h3>
              {result.vgg16?.error ? (
                <p className="text-sm text-red-500 py-10">{result.vgg16.error}</p>
              ) : (
                <>
                  <CircularProgress percentage={result.vgg16?.confidence_percentage} colorStr="#81C784" />
                  <div className="mt-4">
                    <p className="text-[#8D6E63] text-sm font-bold uppercase tracking-wider mb-1">Prediksi</p>
                    <p className="font-bold text-lg text-slate-800 mb-4">{formatNamaBencana(result.vgg16?.prediction)}</p>
                    <div className="bg-[#FAFAFA] px-4 py-2 rounded-lg inline-block border border-gray-100">
                      <p className="text-xs text-[#8D6E63] font-bold uppercase mb-1">Waktu Inferensi</p>
                      <p className="font-black text-[#81C784]">{result.vgg16?.waktu_eksekusi_ms} ms</p>
                    </div>
                  </div>
                </>
              )}
            </div>

          </div>
        )}

        {/* STATE: BUKAN BENCANA */}
        {isSuccess && !isValidDisaster && (
          <div className="bg-[#FFFFFF] border-2 border-orange-200 rounded-2xl p-10 text-center max-w-2xl mx-auto shadow-sm">
            <ImageOff size={64} className="text-orange-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Bukan Kategori Bencana</h3>
            <p className="text-[#8D6E63] font-medium mb-6">
              Sistem mendeteksi gambar ini sebagai <strong className="text-slate-800">"{formatNamaBencana(predictedLabel)}"</strong>. Pengujian hanya valid untuk citra Kekeringan dan Tanah Longsor.
            </p>
            <button 
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#8D6E63] hover:bg-[#6d4c41] text-white font-bold rounded-full transition-all"
            >
              <RefreshCcw size={18} /> Uji Gambar Lain
            </button>
          </div>
        )}

        {/* STATE: ERROR */}
        {result && result.status === 'error' && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center max-w-2xl mx-auto">
            <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
            <h3 className="font-bold text-xl text-red-800 mb-2">Terjadi Kesalahan</h3>
            <p className="text-red-600">{result.message}</p>
          </div>
        )}

      </div>
    </div>
  );
}