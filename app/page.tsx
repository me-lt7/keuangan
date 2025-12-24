"use client";

import { useEffect, useState } from "react";
import TransactionForm from "./components/TransactionForm";
import { FiTrash2, FiArrowUpCircle, FiArrowDownCircle, FiRepeat, FiDownload } from "react-icons/fi";
import { fetchTransactions, saveTransactions, downloadTransactionsAsJSON, type Transaction } from "./lib/storage";

type DeleteConfirmation = {
  transaction: Transaction;
  onConfirm: () => void;
  onCancel: () => void;
};

function DeleteConfirmationModal({ transaction, onConfirm, onCancel }: DeleteConfirmation) {
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

export default function HomePage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newestFirst, setNewestFirst] = useState<boolean>(true);
  const [deleteModal, setDeleteModal] = useState<{ transaction: Transaction } | null>(null);

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

  const addTransaction = (transaction: Transaction) => {
    setTransactions((prev) => {
      if (prev.some((p) => p.id === transaction.id)) return prev;
      const next = [...prev, transaction];
      saveTransactions(next).catch((e) => {
        console.error("Failed to save transaction:", e);
        setError("Gagal menyimpan transaksi");
      });
      return next;
    });
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => {
      const next = prev.filter((t) => t.id !== id);
      saveTransactions(next).catch((e) => {
        console.error("Failed to delete transaction:", e);
        setError("Gagal menghapus transaksi");
      });
      return next;
    });
    setDeleteModal(null);
  };

  const now = new Date();
  const cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const recentTransactions = transactions.filter(
    (t) => new Date(t.date) >= cutoff
  );

  const sortedRecent = [...recentTransactions].sort((a, b) => {
    const ta = new Date(a.date).getTime();
    const tb = new Date(b.date).getTime();
    return newestFirst ? tb - ta : ta - tb;
  });

  const totalIncome = recentTransactions
    .filter((t) => t.type === "Pemasukan" && typeof t.amount === "number")
    .reduce((sum, t) => sum + (t.amount || 0), 0);
  const totalExpense = recentTransactions
    .filter((t) => t.type === "Pengeluaran" && typeof t.amount === "number")
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  const dailyIncome = transactions
    .filter((t) => {
      const d = new Date(t.date);
      return (
        d >= startOfToday &&
        d <= endOfToday &&
        t.type === "Pemasukan" &&
        typeof t.amount === "number"
      );
    })
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const dailyExpense = transactions
    .filter((t) => {
      const d = new Date(t.date);
      return (
        d >= startOfToday &&
        d <= endOfToday &&
        t.type === "Pengeluaran" &&
        typeof t.amount === "number"
      );
    })
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const dailyTotal = dailyIncome - dailyExpense;

  return (
    <div className="space-y-6">
      {deleteModal && (
        <DeleteConfirmationModal
          transaction={deleteModal.transaction}
          onConfirm={() => deleteTransaction(deleteModal.transaction.id)}
          onCancel={() => setDeleteModal(null)}
        />
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-12 text-gray-500">Memuat data...</div>
      ) : (
        <>
          <TransactionForm onAdd={addTransaction} />

          {/* === BAGIAN TOTAL, PEMASUKAN, PENGELUARAN === */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Pemasukan */}
            <div className="bg-white shadow rounded-lg p-4 flex items-center gap-4">
              <div className="w-14 h-14 rounded-full flex items-center justify-center shadow-md bg-gradient-to-br from-emerald-100 to-emerald-50">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-emerald-400 to-emerald-500 text-white">
                  <FiArrowUpCircle className="text-2xl" />
                </div>
              </div>
              <div className="min-w-0">
                <p className="text-sm text-slate-500">Pemasukan</p>
                <p className="text-lg font-bold text-green-700 break-words whitespace-normal leading-tight">
                  Rp {totalIncome.toLocaleString()}
                </p>
                <p className="text-xs text-slate-500 break-words whitespace-normal">
                  Hari ini: Rp {dailyIncome.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Pengeluaran */}
            <div className="bg-white shadow rounded-lg p-4 flex items-center gap-4">
              <div className="w-14 h-14 rounded-full flex items-center justify-center shadow-md bg-gradient-to-br from-rose-100 to-rose-50">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-rose-400 to-rose-500 text-white">
                  <FiArrowDownCircle className="text-2xl" />
                </div>
              </div>
              <div className="min-w-0">
                <p className="text-sm text-slate-500">Pengeluaran</p>
                <p className="text-lg font-bold text-red-700 break-words whitespace-normal leading-tight">
                  Rp {totalExpense.toLocaleString()}
                </p>
                <p className="text-xs text-slate-500 break-words whitespace-normal">
                  Hari ini: Rp {dailyExpense.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Total */}
            <div className="bg-white shadow rounded-lg p-4 flex items-center gap-4">
              <div className="w-14 h-14 rounded-full flex items-center justify-center shadow-md bg-gradient-to-br from-indigo-100 to-indigo-50">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-violet-500 text-white">
                  <span className="text-lg font-bold">Σ</span>
                </div>
              </div>
              <div className="min-w-0">
                <p className="text-sm text-slate-500">Total</p>
                <p className="text-lg font-bold break-words whitespace-normal leading-tight">
                  Rp {(totalIncome - totalExpense).toLocaleString()}
                </p>
                <p className="text-xs text-slate-500 break-words whitespace-normal">
                  Hari ini: Rp {dailyTotal.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* === DAFTAR TRANSAKSI === */}
          <div className="bg-white shadow rounded-lg p-4">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <h2 className="text-xl font-semibold">Daftar Transaksi</h2>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => downloadTransactionsAsJSON(transactions)}
                  className="text-sm text-white bg-indigo-600 px-3 py-1 rounded-md hover:bg-indigo-700 flex items-center gap-2"
                  title="Download transaksi saat ini sebagai JSON"
                >
                  <FiDownload />
                  <span>Download</span>
                </button>
                <button
                  type="button"
                  onClick={() => setNewestFirst((v) => !v)}
                  className="text-sm text-slate-600 bg-slate-50 px-3 py-1 rounded-md hover:bg-slate-100 flex items-center gap-2"
                >
                  <FiRepeat />
                  <span>{newestFirst ? "Tampilkan: Terbaru" : "Tampilkan: Terlama"}</span>
                </button>
              </div>
            </div>

            {recentTransactions.length === 0 ? (
              <p className="text-gray-500">Belum ada transaksi dalam 30 hari terakhir.</p>
            ) : (
              <ul className="divide-y bg-white">
                {sortedRecent.map((t) => (
                  <li
                    key={t.id}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-md bg-slate-50 flex items-center justify-center">
                        {t.type === "Pemasukan" ? (
                          <FiArrowUpCircle className="text-green-500 text-xl" />
                        ) : (
                          <FiArrowDownCircle className="text-red-500 text-xl" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold">{t.description}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(t.date).toLocaleDateString("id-ID", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
                          — {t.type}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start sm:items-center gap-3 ml-auto">
                      <div className="text-right">
                        <span
                          className={`font-bold text-lg break-words whitespace-normal ${
                            t.type === "Pemasukan" ? "text-green-600" : "text-red-600"
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
                      <button
                        onClick={() => setDeleteModal({ transaction: t })}
                        className="p-2 rounded-md bg-red-50 text-red-600 hover:bg-red-100"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}
