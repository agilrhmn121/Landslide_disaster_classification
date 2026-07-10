'use client';

import React, { useState } from 'react';
import {
  Upload, Loader2, ArrowRight, ImageOff,
  Mountain, Droplets, TreePine, Waves,
  Cpu, Layers, Workflow,
  UploadCloud, ScanEye, Tags, FileCheck2,
  Clock, Target, ListChecks, Smartphone, ShieldCheck, MousePointerClick,
} from 'lucide-react';

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
        <circle cx="56" cy="56" r={radius} stroke="#F3F4F6" strokeWidth="8" fill="transparent" />
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

// ==========================================
// DATA STATIS UNTUK SECTION BARU
// ==========================================
const kategoriBencana = [
  { label: 'Tanah Longsor', icon: Mountain, grad: 'from-[#8D6E63] to-[#5D4037]' },
  { label: 'Kekeringan', icon: Droplets, grad: 'from-[#D9A441] to-[#B57A1F]' },
  { label: 'Lahan Aman', icon: TreePine, grad: 'from-[#2E7D32] to-[#1B5E20]' },
  { label: 'Erosi Ringan', icon: Waves, grad: 'from-[#81C784] to-[#4C9A4E]' },
];

const teknologi = [
  {
    nama: 'MobileNetV2, ResNet50 & VGG16',
    icon: Layers,
    desc: 'Tiga arsitektur Convolutional Neural Network yang saling melengkapi untuk membandingkan akurasi dan kecepatan klasifikasi citra bencana.',
  },
  {
    nama: 'TensorFlow / Keras',
    icon: Cpu,
    desc: 'Kerangka kerja deep learning yang menjalankan inferensi model secara efisien di sisi server.',
  },
  {
    nama: 'Next.js API Route',
    icon: Workflow,
    desc: 'Backend ringan yang menghubungkan antarmuka pengguna dengan proses prediksi model secara real-time.',
  },
];

const langkahKerja = [
  { title: 'Upload Gambar', desc: 'Unggah foto lanskap yang ingin dianalisis.', icon: UploadCloud },
  { title: 'AI Analysis', desc: 'Sistem memproses gambar menggunakan tiga model CNN.', icon: ScanEye },
  { title: 'Classification', desc: 'Gambar dikategorikan: Longsor, Kekeringan, atau Aman.', icon: Tags },
  { title: 'Get Results', desc: 'Terima laporan detail beserta tingkat keyakinan model.', icon: FileCheck2 },
];

const fiturUnggulan = [
  { title: 'Real-time Processing', desc: 'Analisis gambar dalam hitungan detik untuk hasil yang cepat.', icon: Clock },
  { title: 'High Accuracy', desc: 'Model terlatih dengan dataset besar mencapai akurasi tinggi.', icon: Target },
  { title: 'Detailed Insights', desc: 'Informasi lengkap tentang tingkat risiko dan rekomendasi.', icon: ListChecks },
  { title: 'Responsive Design', desc: 'Tampilan optimal di berbagai perangkat, desktop maupun ponsel.', icon: Smartphone },
  { title: 'Secure & Private', desc: 'Data gambar Anda tidak disimpan dan diproses secara aman.', icon: ShieldCheck },
  { title: 'Easy to Use', desc: 'Antarmuka ramah pengguna, mudah diakses oleh siapa saja.', icon: MousePointerClick },
];

export default function UserDashboardLanding() {
  // State untuk Prediksi
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // ==========================================
  // PREDICTION LOGIC
  // ==========================================
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
    }
  };

const handlePredict = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setResult(null);

    const formData = new FormData();
    // Pastikan key 'image' ini sama dengan yang ada di FastAPI (misal: file: UploadFile)
    // Jika di FastAPI namanya 'file', ganti 'image' di bawah ini menjadi 'file'
    formData.append('image', selectedFile);

    try {
      // URL diganti ke Hugging Face (pastikan endpoint /predict sesuai dengan di main.py Anda)
   const response = await fetch('https://idiom-acid-reselect.ngrok-free.dev/predict', {
        method: 'POST',
        headers: {
          'ngrok-skip-browser-warning': 'true'
        },
        body: formData
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ status: 'error', message: 'Gagal menghubungi server AI.' });
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

  // ==========================================
  // MAIN RENDER (SINGLE PAGE SCROLL)
  // ==========================================
  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans text-slate-800 scroll-smooth">

      {/* NAVBAR */}
      <header className="bg-[#FFFFFF] shadow-sm px-4 sm:px-8 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="font-black text-2xl text-[#2E7D32] tracking-tight flex items-center gap-2">
          Bencana AI <span className="text-[#81C784] text-xl">V2</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm font-bold text-[#8D6E63]">
          <a href="#tentang" className="hover:text-[#2E7D32] transition-colors">Tentang</a>
          <a href="#teknologi" className="hover:text-[#2E7D32] transition-colors">Teknologi</a>
          <a href="#cara-kerja" className="hover:text-[#2E7D32] transition-colors">Cara Kerja</a>
          <a href="#fitur" className="hover:text-[#2E7D32] transition-colors">Fitur</a>
          <a href="#uji-ai" className="hover:text-[#2E7D32] transition-colors">Uji AI</a>
        </nav>
        <div className="flex items-center gap-4">
          <a
            href="#uji-ai"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-[#2E7D32] text-white hover:bg-[#1b5e20] rounded-xl font-bold text-sm transition-colors"
          >
            Uji AI
          </a>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="px-4 sm:px-8 py-16 max-w-6xl mx-auto">
        <div className="bg-[#2E7D32] text-[#FFFFFF] p-8 md:p-16 rounded-[2rem] shadow-lg relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="relative z-10 md:w-2/3">
            <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">Deteksi Dini Bencana Alam</h1>
            <p className="text-[#81C784] font-medium text-lg mb-8 max-w-xl">
              Sistem peringatan cerdas berbasis Deep Learning untuk mengenali pola visual Kekeringan (Drought) dan Tanah Longsor (Land Slide).
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#uji-ai"
                className="inline-flex items-center gap-2 bg-[#81C784] hover:bg-[#a5d6a7] text-[#2E7D32] px-8 py-4 rounded-full font-bold text-lg transition-transform transform hover:-translate-y-1"
              >
                Coba Sekarang <ArrowRight size={20} />
              </a>
              <a
                href="#tentang"
                className="inline-flex items-center gap-2 bg-transparent border-2 border-[#81C784] text-[#FFFFFF] px-8 py-4 rounded-full font-bold text-lg transition-colors hover:bg-white/10"
              >
                Pelajari Lebih Lanjut
              </a>
            </div>
          </div>
          <div className="absolute right-0 top-0 w-96 h-96 bg-[#81C784] opacity-20 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3"></div>
        </div>
      </section>

      {/* SECTION: TENTANG SISTEM KAMI */}
      <section id="tentang" className="px-4 sm:px-8 py-16 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#2E7D32] mb-2">Tentang Sistem Kami</h2>
          <p className="text-[#8D6E63] font-medium max-w-2xl mx-auto">
            Bencana AI membantu mengenali indikasi kekeringan dan tanah longsor dari citra lanskap,
            sehingga proses pemantauan dini dapat dilakukan lebih cepat dan efisien.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {kategoriBencana.map(({ label, icon: Icon, grad }) => (
            <div
              key={label}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:-translate-y-1 transition-transform"
            >
              <div className={`h-28 w-full bg-gradient-to-br ${grad} flex items-center justify-center`}>
                <Icon size={40} className="text-white" strokeWidth={1.75} />
              </div>
              <p className="text-center font-bold text-sm py-3 text-slate-800">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION: TEKNOLOGI CANGGIH */}
      <section id="teknologi" className="px-4 sm:px-8 py-16 bg-[#FFFFFF] border-y border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#2E7D32] mb-2">Teknologi Canggih</h2>
            <p className="text-[#8D6E63] font-medium">Ditenagai oleh kerangka kerja deep learning modern.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {teknologi.map(({ nama, icon: Icon, desc }) => (
              <div key={nama} className="bg-[#FAFAFA] p-8 rounded-2xl border border-gray-100">
                <div className="w-14 h-14 rounded-xl bg-[#2E7D32] flex items-center justify-center mb-6">
                  <Icon size={26} className="text-white" strokeWidth={1.75} />
                </div>
                <h3 className="font-bold text-lg text-slate-800 mb-2">{nama}</h3>
                <p className="text-sm text-[#8D6E63] font-medium leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <a
              href="#uji-ai"
              className="inline-flex items-center gap-2 bg-[#2E7D32] hover:bg-[#1b5e20] text-white px-8 py-3 rounded-full font-bold transition-colors"
            >
              Analisis Risiko Sekarang <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>

      {/* SECTION: CARA KERJA */}
      <section id="cara-kerja" className="px-4 sm:px-8 py-16 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#2E7D32] mb-2">Cara Kerja</h2>
          <div className="h-1 w-24 bg-[#81C784] mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4 relative">
          {langkahKerja.map(({ title, desc, icon: Icon }, idx) => (
            <div key={title} className="relative flex flex-col items-center text-center px-2">
              <div className="w-16 h-16 rounded-full bg-[#81C784]/20 flex items-center justify-center mb-4">
                <Icon size={28} className="text-[#2E7D32]" strokeWidth={1.75} />
              </div>
              <h3 className="font-bold text-slate-800 mb-1">{title}</h3>
              <p className="text-xs text-[#8D6E63] font-medium leading-relaxed">{desc}</p>

              {idx < langkahKerja.length - 1 && (
                <ArrowRight
                  size={20}
                  className="hidden md:block text-[#81C784] absolute top-6 -right-2 translate-x-1/2"
                />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* SECTION: FITUR UNGGULAN */}
      <section id="fitur" className="px-4 sm:px-8 py-16 bg-[#FFFFFF] border-y border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#2E7D32] mb-2">Fitur Unggulan</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {fiturUnggulan.map(({ title, desc, icon: Icon }) => (
              <div
                key={title}
                className="bg-[#FAFAFA] p-6 rounded-2xl border border-gray-100 flex flex-col items-center text-center hover:shadow-sm transition-shadow"
              >
                <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-4">
                  <Icon size={22} className="text-[#8D6E63]" strokeWidth={1.75} />
                </div>
                <h3 className="font-bold text-sm text-slate-800 mb-1">{title}</h3>
                <p className="text-xs text-[#8D6E63] font-medium leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION: PREDIKSI (TARGET ANCHOR) */}
      <section id="uji-ai" className="px-4 sm:px-8 py-16">
        <div className="max-w-5xl mx-auto">

          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#2E7D32] mb-2">Coba Bencana AI</h2>
            <p className="text-[#8D6E63] font-medium">Unggah foto lanskap untuk dianalisis oleh tiga algoritma kami.</p>
          </div>

          <div className="bg-[#FFFFFF] p-8 md:p-12 rounded-2xl border border-gray-100 mx-auto mb-16 text-center shadow-sm">

            <div className="border-2 border-dashed border-[#81C784] rounded-xl p-8 mb-8 relative flex flex-col items-center justify-center min-h-[250px] bg-[#FAFAFA] hover:bg-white transition-colors cursor-pointer">
              <input
                type="file" accept="image/*" onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              {preview ? (
                <img src={preview} alt="Preview" className="max-h-64 rounded-lg shadow-sm object-contain z-0 relative" />
              ) : (
                <div className="text-center pointer-events-none">
                  <Upload size={40} className="text-[#81C784] mx-auto mb-4" />
                  <p className="font-bold text-[#2E7D32] text-lg">Upload gambar lanskap...</p>
                  <p className="text-sm font-medium text-[#8D6E63] mt-2">Klik atau seret file gambar ke area ini.</p>
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

          {/* HASIL EVALUASI */}
          {(loading || result) && (
            <div className="mt-16">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-[#2E7D32] mb-2">Evaluasi Model</h2>
                <div className="h-1 w-24 bg-[#81C784] mx-auto rounded-full"></div>
              </div>

              {loading && (
                <div className="flex justify-center py-10">
                  <Loader2 size={48} className="animate-spin text-[#81C784]" />
                </div>
              )}

              {isSuccess && isValidDisaster && result.mobilenet && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* MobileNetV2 */}
                  <div className="bg-[#FFFFFF] p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                    <h3 className="font-bold text-xl text-[#2E7D32] mb-6">MobileNetV2</h3>
                    <CircularProgress percentage={result.mobilenet.confidence_percentage} colorStr="#2E7D32" />
                    <div className="mt-4 w-full">
                      <p className="font-bold text-lg text-slate-800 mb-4">{formatNamaBencana(result.mobilenet.prediction)}</p>
                      <div className="bg-[#FAFAFA] px-4 py-3 rounded-lg flex justify-between items-center w-full">
                        <span className="text-xs text-[#8D6E63] font-bold uppercase">Waktu</span>
                        <span className="font-black text-[#2E7D32]">{result.mobilenet.waktu_eksekusi_ms} ms</span>
                      </div>
                    </div>
                  </div>

                  {/* ResNet50 */}
                  <div className="bg-[#FFFFFF] p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                    <h3 className="font-bold text-xl text-[#8D6E63] mb-6">ResNet50</h3>
                    {result.resnet50?.error ? (
                      <p className="text-sm text-red-500 py-10">{result.resnet50.error}</p>
                    ) : (
                      <>
                        <CircularProgress percentage={result.resnet50?.confidence_percentage} colorStr="#8D6E63" />
                        <div className="mt-4 w-full">
                          <p className="font-bold text-lg text-slate-800 mb-4">{formatNamaBencana(result.resnet50?.prediction)}</p>
                          <div className="bg-[#FAFAFA] px-4 py-3 rounded-lg flex justify-between items-center w-full">
                            <span className="text-xs text-[#8D6E63] font-bold uppercase">Waktu</span>
                            <span className="font-black text-[#8D6E63]">{result.resnet50?.waktu_eksekusi_ms} ms</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* VGG16 */}
                  <div className="bg-[#FFFFFF] p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                    <h3 className="font-bold text-xl text-[#81C784] mb-6">VGG16</h3>
                    {result.vgg16?.error ? (
                      <p className="text-sm text-red-500 py-10">{result.vgg16.error}</p>
                    ) : (
                      <>
                        <CircularProgress percentage={result.vgg16?.confidence_percentage} colorStr="#81C784" />
                        <div className="mt-4 w-full">
                          <p className="font-bold text-lg text-slate-800 mb-4">{formatNamaBencana(result.vgg16?.prediction)}</p>
                          <div className="bg-[#FAFAFA] px-4 py-3 rounded-lg flex justify-between items-center w-full">
                            <span className="text-xs text-[#8D6E63] font-bold uppercase">Waktu</span>
                            <span className="font-black text-[#81C784]">{result.vgg16?.waktu_eksekusi_ms} ms</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {isSuccess && !isValidDisaster && (
                <div className="bg-[#FFFFFF] border-2 border-orange-200 rounded-2xl p-10 text-center max-w-2xl mx-auto">
                  <ImageOff size={64} className="text-orange-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">Bukan Kategori Bencana</h3>
                  <p className="text-[#8D6E63] mb-6">Terdeteksi sebagai: <strong>{formatNamaBencana(predictedLabel)}</strong>.</p>
                  <button onClick={handleReset} className="px-6 py-3 bg-[#8D6E63] text-white font-bold rounded-full">
                    Uji Gambar Lain
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-4 sm:px-8 py-10 text-center border-t border-gray-100">
        <p className="text-sm font-medium text-[#8D6E63]">
          © {new Date().getFullYear()} Bencana AI. Sistem deteksi dini berbasis Deep Learning.
        </p>
      </footer>

    </div>
  );
}
