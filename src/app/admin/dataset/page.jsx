import React from 'react';

const DatasetPage = () => {
  const dataDistribution = [
    { class: "Drought", count: 201 },
    { class: "Land Slide", count: 456 },
    { class: "Human", count: 120 },
    { class: "Non Damage Buildings Street", count: 4572 },
    { class: "Non Damage Wildlife Forest", count: 300 },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Manajemen Dataset</h1>
      <p className="text-gray-600 mb-8">Pusat informasi distribusi citra untuk melatih model klasifikasi bencana daratan[cite: 62].</p>

      {/* Ringkasan Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Gambar" value="7,620" />
        <StatCard title="Total Kelas" value="5" />
        <StatCard title="Split Rasio" value="80% Train / 20% Test" />
      </div>

      {/* Tabel Distribusi */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
        <h2 className="text-xl font-semibold mb-6">Distribusi Data per Kelas</h2>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 text-left">
              <th className="pb-4 text-gray-500">Kelas Bencana</th>
              <th className="pb-4 text-gray-500 text-right">Jumlah Citra</th>
            </tr>
          </thead>
          <tbody>
            {dataDistribution.map((item, index) => (
              <tr key={index} className="border-b border-gray-50 last:border-0">
                <td className="py-4 font-medium text-gray-700">{item.class}</td>
                <td className="py-4 text-right font-mono">{item.count.toLocaleString()}</td>
              </tr>
            ))}
            <tr className="bg-gray-50 font-bold">
              <td className="py-4 px-2">TOTAL</td>
              <td className="py-4 text-right font-mono">7,620</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Catatan Teknis (Penting untuk Sidang) */}
      <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
        <h3 className="font-bold text-blue-900 mb-2">Catatan Metodologi Dataset</h3>
        <p className="text-blue-800 text-sm">
          Data ini memiliki distribusi yang tidak seimbang (*imbalanced data*)[cite: 18]. 
          Untuk mengatasinya, sistem menerapkan teknik <i>Data Augmentation</i> secara *real-time* dengan parameter rotasi, pergeseran (width/height shift), dan pembalikan horizontal 
          guna memastikan model tidak mengalami *overfitting*[cite: 77, 79, 82].
        </p>
      </div>
    </div>
  );
};

const StatCard = ({ title, value }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
    <h4 className="text-sm text-gray-500 uppercase tracking-wide">{title}</h4>
    <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
  </div>
);

export default DatasetPage;