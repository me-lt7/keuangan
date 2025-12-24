'use client';

import { useState } from 'react';
import { FaMobile, FaMoneyBillWave, FaTools, FaCalendarAlt, FaPrint } from 'react-icons/fa';
import { BiSolidCollection } from 'react-icons/bi';

export default function GaransiPage() {
  const [formData, setFormData] = useState({
    phoneModel: '',
    price: '',
    quantity: '1',
    serviceType: '',
    serviceDate: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.print();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Calculate warranty expiry date (1 month from service date)
  const warrantyExpiry = formData.serviceDate 
    ? new Date(new Date(formData.serviceDate).setMonth(new Date(formData.serviceDate).getMonth() + 1)).toLocaleDateString('id-ID')
    : '';

  return (
    <div className="space-y-6">
      <div className="max-w-md mx-auto">
        <div className="bg-white shadow rounded-lg p-6 print:hidden">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
              <FaTools className="text-2xl" />
            </div>
            <h2 className="text-xl font-semibold">Kartu Garansi Service</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="flex items-center text-gray-700 text-sm font-semibold mb-2">
                <FaMobile className="mr-2" /> Model HP
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="phoneModel"
                  value={formData.phoneModel}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                  placeholder="Contoh: iPhone 11 Pro"
                />
              </div>
            </div>

            <div>
              <label className="flex items-center text-gray-700 text-sm font-semibold mb-2">
                <FaMoneyBillWave className="mr-2" /> Harga Service
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">Rp</span>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                  placeholder="Masukkan harga"
                />
              </div>
            </div>

            <div>
              <label className="flex items-center text-gray-700 text-sm font-semibold mb-2">
                <BiSolidCollection className="mr-2" /> Jumlah Unit
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                  min="1"
                />
              </div>
            </div>

            <div>
              <label className="flex items-center text-gray-700 text-sm font-semibold mb-2">
                <FaTools className="mr-2" /> Jenis Service
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                  placeholder="Contoh: Ganti LCD, Battery, dll"
                />
              </div>
            </div>

            <div>
              <label className="flex items-center text-gray-700 text-sm font-semibold mb-2">
                <FaCalendarAlt className="mr-2" /> Tanggal Service
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="serviceDate"
                  value={formData.serviceDate}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center font-semibold"
            >
              <FaPrint className="mr-2" /> Print Garansi
            </button>
          </form>
        </div>

        {/* Screen preview for the warranty card (visible on screen, hidden when printing) */}
  <div className="bg-white p-4 mt-6 mb-4 shadow-sm print:hidden" style={{ WebkitPrintColorAdjust: 'exact' as any, printColorAdjust: 'exact' as any }}>
          <div className="text-center">
            <h2 className="text-base font-bold">KARTU GARANSI (Preview)</h2>
            <p className="text-[10px]">Garansi berlaku 1 bulan sejak tanggal service</p>
          </div>

          <div className="space-y-2 text-[12px]">
            <div>
              <p className="font-semibold">Model HP:</p>
              <p className="border-b border-black text-[11px]">{formData.phoneModel}</p>
            </div>

            <div className="flex justify-between">
              <div className="w-1/2">
                <p className="font-semibold">Harga:</p>
                <p className="border-b border-black text-[11px]">Rp {Number(formData.price || 0).toLocaleString('id-ID')}</p>
              </div>
              <div className="w-1/3">
                <p className="font-semibold">Qty:</p>
                <p className="border-b border-black text-[11px]">{formData.quantity} unit</p>
              </div>
            </div>

            <div>
              <p className="font-semibold">Service:</p>
              <p className="border-b border-black text-[11px]">{formData.serviceType}</p>
            </div>

            <div className="space-y-2">
              <div>
                <p className="font-semibold">Tgl Service:</p>
                <p className="border-b border-black text-[11px]">
                  {formData.serviceDate ? new Date(formData.serviceDate).toLocaleDateString('id-ID') : ''}
                </p>
              </div>
              <div>
                <p className="font-semibold">Garansi Sampai:</p>
                <p className="border-b border-black text-[11px]">{warrantyExpiry}</p>
              </div>
            </div>

            <div className="mt-2">
              <p className="text-[10px]">
                * Garansi berlaku untuk kerusakan yang sama<br />
                * Garansi tidak berlaku jika kartu garansi hilang<br />
                * Simpan kartu garansi untuk klaim
              </p>
            </div>

            <div className="mt-4 text-center">
              <div className="inline-block border-t border-black px-4 pt-1 text-[10px]">
                Gadget Nusantara
              </div>
            </div>
          </div>
        </div>

        {/* Printable Warranty Card */}
        <div className="print:block hidden bg-white p-4" style={{ WebkitPrintColorAdjust: 'exact' as any, printColorAdjust: 'exact' as any }}>
          <div className="text-center">
            <h2 className="text-base font-bold">KARTU GARANSI</h2>
            <p className="text-[10px]">Garansi berlaku 1 bulan sejak tanggal service</p>
          </div>

          <div className="space-y-2 text-[12px]">
            <div>
              <p className="font-semibold">Model HP:</p>
              <p className="border-b border-black text-[11px]">{formData.phoneModel}</p>
            </div>

            <div className="flex justify-between">
              <div className="w-1/2">
                <p className="font-semibold">Harga:</p>
                <p className="border-b border-black text-[11px]">Rp {Number(formData.price).toLocaleString('id-ID')}</p>
              </div>
              <div className="w-1/3">
                <p className="font-semibold">Qty:</p>
                <p className="border-b border-black text-[11px]">{formData.quantity} unit</p>
              </div>
            </div>

            <div>
              <p className="font-semibold">Service:</p>
              <p className="border-b border-black text-[11px]">{formData.serviceType}</p>
            </div>

            <div className="space-y-2">
              <div>
                <p className="font-semibold">Tgl Service:</p>
                <p className="border-b border-black text-[11px]">
                  {formData.serviceDate ? new Date(formData.serviceDate).toLocaleDateString('id-ID') : ''}
                </p>
              </div>
              <div>
                <p className="font-semibold">Garansi Sampai:</p>
                <p className="border-b border-black text-[11px]">{warrantyExpiry}</p>
              </div>
            </div>

            <div className="mt-2">
              <p className="text-[10px]">
                * Garansi berlaku untuk kerusakan yang sama<br />
                * Garansi tidak berlaku jika kartu garansi hilang<br />
                * Simpan kartu garansi untuk klaim
              </p>
            </div>

            <div className="mt-4 text-center">
              <div className="inline-block border-t border-black px-4 pt-1 text-[10px]">
                Gadget Nusantara
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
