"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import {
  FiTrash2,
  FiArrowUpCircle,
  FiArrowDownCircle,
  FiRepeat,
  FiCalendar,
  FiX,
  FiEdit,
  FiSave,
  FiDollarSign,
  FiDownload,
  FiUpload,
} from "react-icons/fi";
import { fetchTransactions, saveTransactions, downloadTransactionsAsJSON, type Transaction } from "../lib/storage";

type DeleteConfirmation = {
  transaction: Transaction;
  onConfirm: () => void;
  onCancel: () => void;
};

function DeleteConfirmationModal({
  transaction,
  onConfirm,
  onCancel,
}: DeleteConfirmation) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 space-y-4">
        <div className="flex items-center gap-3 text-red-600">
          <FiTrash2 className="text-2xl" />
          <h3 className="text-lg font-semibold">Konfirmasi Penghapusan</h3>
        </div>

        <div className="space-y-3">
          <p className="text-gray-600">
            Transaksi ini akan dihapus permanen dan tidak bisa dipulihkan.
          </p>

          <div className="bg-slate-50 p-4 rounded space-y-2">
            <div className="flex items-center gap-2">
              {transaction.type === "Pemasukan" ? (
                <FiArrowUpCircle className="text-green-500" />
              ) : (
                <FiArrowDownCircle className="text-red-500" />
              )}
              <span className="text-gray-600">{transaction.type}</span>
            </div>
            <div className="min-w-0">
              <div
                className={`font-bold text-lg break-all ${
                  transaction.type === "Pemasukan"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                Rp {transaction.amount.toLocaleString()}
              </div>
              <div className="text-gray-600 break-words">
                {transaction.description}
              </div>
              <div className="text-sm text-gray-500 truncate">
                {new Date(transaction.date).toLocaleDateString("id-ID", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}

type EditModalProps = {
  transaction: Transaction;
  onSave: (updated: Transaction) => Promise<void> | void;
  onCancel: () => void;
};

function formatToDatetimeLocal(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const min = pad(d.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
}

function EditTransactionModal({ transaction, onSave, onCancel }: EditModalProps) {
  const [desc, setDesc] = useState(transaction.description);
  const [amount, setAmount] = useState(String(transaction.amount ?? 0));
  const [type, setType] = useState<Transaction["type"]>(transaction.type);
  const [date, setDate] = useState(formatToDatetimeLocal(transaction.date));
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      const updated: Transaction = {
        ...transaction,
        description: desc,
        amount: Number(amount) || 0,
        type,
        date: new Date(date).toISOString(),
      };
      await onSave(updated);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Edit Transaksi</h3>
          <button onClick={onCancel} className="p-2 rounded hover:bg-slate-100">
            <FiX />
          </button>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-600">Deskripsi</label>
          <input value={desc} onChange={(e) => setDesc(e.target.value)} className="w-full border rounded px-3 py-2" />

          <label className="text-sm text-gray-600">Jumlah</label>
          <input value={amount} onChange={(e) => setAmount(e.target.value)} type="number" className="w-full border rounded px-3 py-2" />

          <label className="text-sm text-gray-600">Tipe</label>
          <select value={type} onChange={(e) => setType(e.target.value as Transaction["type"])} className="w-full border rounded px-3 py-2">
            <option value="Pemasukan">Pemasukan</option>
            <option value="Pengeluaran">Pengeluaran</option>
          </select>

          <label className="text-sm text-gray-600">Tanggal & Waktu</label>
          <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} className="w-full border rounded px-3 py-2" />
        </div>

        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Batal</button>
          <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            {saving ? 'Menyimpan...' : (<><FiSave className="inline mr-2"/>Simpan</>)}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function HistoryPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newestFirst, setNewestFirst] = useState(true);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ transaction: Transaction } | null>(null);
  const [editModal, setEditModal] = useState<{ transaction: Transaction } | null>(null);
  const [downloadJson, setDownloadJson] = useState<string | null>(null);
  const [editedJson, setEditedJson] = useState<string | null>(null);
  const [uploadJson, setUploadJson] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    async function loadTransactions() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchTransactions();
        setTransactions(data);
      } catch (e) {
        console.error("Failed to load transactions:", e);
        setError("Gagal memuat data transaksi");
      } finally {
        setIsLoading(false);
      }
    }
    loadTransactions();
  }, []);

  const deleteTransaction = async (id: string) => {
    try {
      setError(null);
      const next = transactions.filter((t) => t.id !== id);
      await saveTransactions(next);
      setTransactions(next);
      setDeleteModal(null);
    } catch (e) {
      console.error("Failed to delete transaction:", e);
      setError("Gagal menghapus transaksi");
    }
  };

  const updateTransaction = async (updated: Transaction) => {
    try {
      setError(null);
      const next = transactions.map((t) => (t.id === updated.id ? updated : t));
      await saveTransactions(next);
      setTransactions(next);
      setEditModal(null);
    } catch (e) {
      console.error("Failed to update transaction:", e);
      setError("Gagal menyimpan perubahan transaksi");
    }
  };

  const fmt = (iso?: string | null) => {
    if (!iso) return "-";
    try {
      return new Date(iso).toLocaleDateString("id-ID", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return iso;
    }
  };

  const filteredSorted = useMemo(() => {
    let list = transactions.slice();
    if (startDate) {
      const s = new Date(startDate);
      list = list.filter((t) => new Date(t.date) >= s);
    }
    if (endDate) {
      const e = new Date(endDate);
      e.setHours(23, 59, 59, 999);
      list = list.filter((t) => new Date(t.date) <= e);
    }
    list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    if (!newestFirst) list.reverse();
    return list;
  }, [transactions, startDate, endDate, newestFirst]);

  const totals = useMemo(() => {
    let income = 0;
    let expense = 0;
    for (const t of filteredSorted) {
      const amt = typeof t.amount === "number" && !isNaN(t.amount) ? t.amount : 0;
      if (t.type === "Pemasukan") income += amt;
      else expense += amt;
    }
    return { income, expense, net: income - expense };
  }, [filteredSorted]);

  const isEditedJsonValid = useMemo(() => {
    if (!editedJson) return false;
    try {
      JSON.parse(editedJson);
      return true;
    } catch {
      return false;
    }
  }, [editedJson]);

  const isUploadJsonValid = useMemo(() => {
    if (!uploadJson) return false;
    try {
      const parsed = JSON.parse(uploadJson);
      return Array.isArray(parsed);
    } catch {
      return false;
    }
  }, [uploadJson]);

  function handleFilePicked(file?: File | null) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result ?? "");
      setUploadJson(text);
    };
    reader.onerror = () => {
      setError("Gagal membaca file");
    };
    reader.readAsText(file);
  }

  function normalizeDateToIso(input?: any) {
    try {
      const d = input ? new Date(input) : new Date();
      if (isNaN(d.getTime())) return new Date().toISOString();
      return d.toISOString();
    } catch {
      return new Date().toISOString();
    }
  }

  function generateUniqueId(fallbackSeed?: number) {
    try {
      // prefer crypto.randomUUID when available
      const rnd = (globalThis as any)?.crypto?.randomUUID?.();
      if (typeof rnd === "string") return rnd;
    } catch {}
    // fallback
    return `id-${Date.now()}-${Math.floor(Math.random() * 1e9)}${fallbackSeed ? `-${fallbackSeed}` : ""}`;
  }

  return (
    <div className="space-y-6">
      {deleteModal && (
        <DeleteConfirmationModal
          transaction={deleteModal.transaction}
          onConfirm={() => deleteTransaction(deleteModal.transaction.id)}
          onCancel={() => setDeleteModal(null)}
        />
      )}
      {editModal && (
        <EditTransactionModal
          transaction={editModal.transaction}
          onSave={updateTransaction}
          onCancel={() => setEditModal(null)}
        />
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Bagian kartu summary atas */}
      <div className="bg-white shadow rounded-lg p-6 space-y-6">
        <div className="flex flex-row justify-between items-center">
          <h2 className="text-xl font-semibold max-w-[70%]">
            Semua History Transaksi
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setNewestFirst((v) => !v)}
              title={newestFirst ? "Terbaru dulu" : "Terlama dulu"}
              aria-label="Toggle order"
              className="p-2 rounded-md bg-slate-50 hover:bg-slate-100 flex items-center text-slate-600"
            >
              <FiRepeat className="text-lg" />
            </button>
            <button
              onClick={() => {
                  const data = filteredSorted.map((t) => ({
                    ...t,
                    amount: typeof t.amount === "number" ? t.amount : 0,
                    date: new Date(t.date).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }),
                  }));
                  const json = JSON.stringify(data, null, 2);
                  setDownloadJson(json);
                  setEditedJson(json);
                }}
              className="p-2 rounded-md bg-slate-50 hover:bg-slate-100 flex items-center gap-2 text-slate-600"
              title="Preview & download transaksi dalam format JSON"
            >
              <FiDownload className="text-lg" />
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-md bg-slate-50 hover:bg-slate-100 flex items-center gap-2 text-slate-600"
              title="Upload dan timpa transaksi dari file JSON"
            >
              <FiUpload className="text-lg" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={(e) => handleFilePicked(e.target.files?.[0] ?? null)}
            />
          </div>
        </div>

        <div className="space-y-4">
          {/* Filter tanggal */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="flex items-center gap-2 w-full max-w-3xl">
                <div className="flex items-center gap-2 border rounded-md px-3 py-2 w-full bg-white min-w-0">
                <FiCalendar className="text-slate-400" />
                <input
                  type="date"
                  value={startDate ?? ""}
                  onChange={(e) => setStartDate(e.target.value || null)}
                    className="flex-1 text-sm outline-none min-w-0"
                  aria-label="Dari"
                />
              </div>

                <div className="flex items-center gap-2 border rounded-md px-3 py-2 w-full bg-white min-w-0">
                <FiCalendar className="text-slate-400" />
                <input
                  type="date"
                  value={endDate ?? ""}
                  onChange={(e) => setEndDate(e.target.value || null)}
                    className="flex-1 text-sm outline-none min-w-0"
                  aria-label="Sampai"
                />
              </div>

                <button
                onClick={() => {
                  setStartDate(null);
                  setEndDate(null);
                }}
                  className="p-2 rounded-md bg-slate-50 hover:bg-slate-100 flex-shrink-0"
                aria-label="Clear filters"
                title="Clear filters"
              >
                <FiX />
              </button>
            </div>
          </div>

          {/* Summary pemasukan/pengeluaran/saldo */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-6xl">
            <div className="flex items-start gap-4 p-4 bg-green-50 rounded">
              <FiArrowUpCircle className="text-green-600 text-3xl flex-shrink-0" />
              <div className="min-w-0">
                <div className="text-sm text-gray-600">Total Pemasukan</div>
                <div className="font-bold text-lg text-green-700 break-all">
                  Rp {totals.income.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {startDate || endDate
                    ? `${fmt(startDate)} — ${fmt(endDate)}`
                    : "Seluruh waktu"}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-red-50 rounded">
              <FiArrowDownCircle className="text-red-600 text-3xl flex-shrink-0" />
              <div className="min-w-0">
                <div className="text-sm text-gray-600">Total Pengeluaran</div>
                <div className="font-bold text-lg text-red-700 break-all">
                  Rp {totals.expense.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {startDate || endDate
                    ? `${fmt(startDate)} — ${fmt(endDate)}`
                    : "Seluruh waktu"}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-slate-50 rounded">
              <div
                className={`p-3 rounded-full flex-shrink-0 ${
                  totals.net >= 0 ? "bg-green-100" : "bg-red-100"
                }`}
              >
                <FiDollarSign className="text-slate-700 text-2xl" />
              </div>
              <div className="min-w-0">
                <div className="text-sm text-gray-600">Saldo</div>
                <div
                  className={`font-bold text-lg break-all ${
                    totals.net >= 0 ? "text-green-700" : "text-red-700"
                  }`}
                >
                  Rp {totals.net.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {filteredSorted.length} transaksi
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bagian daftar transaksi dengan background putih */}
      <div className="bg-white shadow rounded-lg p-6">
        {isLoading ? (
          <div className="text-center py-12 text-gray-500">Memuat data...</div>
        ) : transactions.length === 0 ? (
          <p className="text-gray-500">Belum ada transaksi.</p>
        ) : (
          <ul className="divide-y">
            {filteredSorted.map((t) => (
              <li
                key={t.id}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 py-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-50">
                    {t.type === "Pemasukan" ? (
                      <FiArrowUpCircle className="text-green-500 text-xl" />
                    ) : (
                      <FiArrowDownCircle className="text-red-500 text-xl" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold truncate">{t.description}</p>
                    <p className="text-sm text-gray-500">
                      {/* short date for small screens, long for larger */}
                      <span className="block sm:hidden">
                        {new Date(t.date).toLocaleDateString("id-ID", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}{" "}
                        — {t.type}
                      </span>
                      <span className="hidden sm:inline">
                        {new Date(t.date).toLocaleDateString("id-ID", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        — {t.type}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-start sm:items-center gap-3 sm:ml-auto ml-0 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="text-right">
                    <span
                      className={`font-bold text-lg break-all sm:break-normal ${
                        t.type === "Pemasukan"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      Rp{" "}
                      {(
                        typeof t.amount === "number" && !isNaN(t.amount)
                          ? t.amount
                          : 0
                      ).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditModal({ transaction: t })}
                      className="p-2 rounded-md bg-slate-50 text-slate-700 hover:bg-slate-100 touch-manipulation flex-shrink-0"
                      aria-label="Edit transaksi"
                    >
                      <FiEdit />
                    </button>
                    <button
                      onClick={() => setDeleteModal({ transaction: t })}
                      className="p-2 rounded-md bg-red-50 text-red-600 hover:bg-red-100 touch-manipulation flex-shrink-0"
                      aria-label="Hapus transaksi"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Download preview modal */}
      {downloadJson && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full p-4 max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Preview JSON Transaksi</h3>
              <button
                onClick={() => setDownloadJson(null)}
                aria-label="Tutup preview"
                className="p-2 rounded hover:bg-slate-100"
              >
                <FiX />
              </button>
            </div>

            <div className="flex-1 overflow-auto bg-slate-50 p-3 rounded text-sm font-mono">
              <textarea
                value={editedJson ?? ""}
                onChange={(e) => setEditedJson(e.target.value)}
                className="w-full h-full min-h-[200px] resize-none bg-transparent outline-none text-xs font-mono"
              />
            </div>


            <div className="mt-3 flex flex-col sm:flex-row gap-2 justify-end items-stretch sm:items-center">
              <div className="flex-1 text-left text-sm text-red-600">
                {!isEditedJsonValid && (
                  <span>JSON tidak valid. Periksa sintaks sebelum mengunduh.</span>
                )}
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setDownloadJson(null)}
                  className="px-4 py-2 rounded bg-slate-100 hover:bg-slate-200"
                >
                  Batal
                </button>
                <button
                  onClick={() => {
                    const json = editedJson ?? downloadJson;
                    const blob = new Blob([json || ""], { type: "application/json" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    const timestamp = new Date().toISOString().split("T")[0];
                    a.href = url;
                    a.download = `transaksi-${timestamp}.json`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    setDownloadJson(null);
                    setEditedJson(null);
                  }}
                  disabled={!isEditedJsonValid}
                  className={`px-4 py-2 rounded text-white ${isEditedJsonValid ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-300 cursor-not-allowed'}`}
                >
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload / Restore modal */}
      {uploadJson && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full p-4 max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Upload & Restore JSON Transaksi</h3>
              <button
                onClick={() => setUploadJson(null)}
                aria-label="Tutup upload"
                className="p-2 rounded hover:bg-slate-100"
              >
                <FiX />
              </button>
            </div>

            <div className="text-sm text-red-600 mb-2">
              <strong>Perhatian:</strong> Data transaksi lama akan <em>digantikan</em> oleh data dari file yang diunggah. Pastikan Anda sudah memiliki cadangan jika perlu.
            </div>

            <div className="flex-1 overflow-auto bg-slate-50 p-3 rounded text-sm font-mono">
              <textarea
                value={uploadJson ?? ""}
                onChange={(e) => setUploadJson(e.target.value)}
                className="w-full h-full min-h-[200px] resize-none bg-transparent outline-none text-xs font-mono"
              />
            </div>

            <div className="mt-3 flex flex-col sm:flex-row gap-2 justify-end items-stretch sm:items-center">
              <div className="flex-1 text-left text-sm text-red-600">
                {!isUploadJsonValid && (
                  <span>JSON tidak valid atau bukan array transaksi. Periksa sintaks sebelum menimpa.</span>
                )}
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setUploadJson(null)}
                  className="px-4 py-2 rounded bg-slate-100 hover:bg-slate-200"
                >
                  Batal
                </button>
                <button
                  onClick={async () => {
                    if (!isUploadJsonValid) return;
                    try {
                      setIsLoading(true);
                      const parsed = JSON.parse(uploadJson as string);
                      if (!Array.isArray(parsed)) throw new Error("Expected array");
                      // ensure every item has a unique id (avoid duplicate React keys)
                      const seen = new Set<string>();
                      const normalized: Transaction[] = parsed.map((it: any, idx: number) => {
                        const rawId = it?.id ? String(it.id) : undefined;
                        const id = rawId && !seen.has(rawId) ? rawId : generateUniqueId(idx);
                        seen.add(id);
                        return {
                          id,
                          description: String(it.description ?? ""),
                          amount: Number(it.amount ?? 0),
                          type: it.type === "Pengeluaran" ? "Pengeluaran" : "Pemasukan",
                          date: normalizeDateToIso(it.date),
                        } as Transaction;
                      });
                      await saveTransactions(normalized);
                      setTransactions(normalized);
                      setUploadJson(null);
                      setError(null);
                    } catch (e) {
                      console.error("Failed to restore transactions:", e);
                      setError("Gagal menimpa data: JSON tidak valid atau format tidak sesuai.");
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                  disabled={!isUploadJsonValid}
                  className={`px-4 py-2 rounded text-white ${isUploadJsonValid ? 'bg-red-600 hover:bg-red-700' : 'bg-red-300 cursor-not-allowed'}`}
                >
                  Timpa Data
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
