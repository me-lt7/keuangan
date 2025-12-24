"use client";

import { useState } from "react";
import { FiPlusCircle, FiMinusCircle, FiCalendar, FiSave } from "react-icons/fi";

interface TransactionFormProps {
  onAdd: (transaction: {
    id: string;
    type: "Pemasukan" | "Pengeluaran";
    description: string;
    amount: number;
    date: string;
  }) => void;
}

export default function TransactionForm({ onAdd }: TransactionFormProps) {
  const [type, setType] = useState<"Pemasukan" | "Pengeluaran">("Pemasukan");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  // Format date for the input field
  const formatDateForInput = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) return alert("Isi deskripsi dan jumlah!");

    const now = new Date();
    // If date is not set, use current date and time
    const transactionDate = date 
      ? new Date(`${date}T${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`)
      : now;

    const id = typeof crypto !== "undefined" && (crypto as any).randomUUID
      ? (crypto as any).randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

    onAdd({
      id,
      type,
      description,
      amount: Number(amount),
      date: transactionDate.toISOString(),
    });

    setDescription("");
    setAmount("");
    setDate("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-lg rounded-xl p-5 space-y-4 border border-slate-100"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Tambah Transaksi</h2>
        <div className="text-sm text-slate-500">Isi data transaksi baru</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="relative">
          <select
            value={type}
            onChange={(e) => setType(e.target.value as "Pemasukan" | "Pengeluaran")}
            className="appearance-none border rounded p-3 w-full pl-10 pr-3"
          >
            <option value="Pemasukan">Pemasukan</option>
            <option value="Pengeluaran">Pengeluaran</option>
          </select>
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            {type === "Pemasukan" ? <FiPlusCircle className="text-green-500 text-lg" /> : <FiMinusCircle className="text-red-500 text-lg" />}
          </div>
        </div>

        <div className="relative">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border rounded p-3 w-full pl-10"
            placeholder={formatDateForInput(new Date())}
            aria-label="Tanggal transaksi (opsional, default hari ini)"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><FiCalendar className="text-lg" /></div>
        </div>
      </div>

      <input
        type="text"
        placeholder="Deskripsi (mis. Gaji, Beli pulsa)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border rounded p-3 w-full focus:ring-2 focus:ring-indigo-200"
      />

      <div className="relative">
        <input
          type="number"
          placeholder="Jumlah (Rp)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border rounded p-3 w-full pl-10"
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><span className="text-sm">Rp</span></div>
      </div>

      <button
        type="submit"
        className="w-full inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 shadow-md touch-manipulation"
      >
        <FiSave /> Simpan
      </button>
    </form>
  );
}
