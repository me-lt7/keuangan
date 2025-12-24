"use client";

import { useMemo, useState, useEffect } from "react";
import { FaPlus, FaTrash, FaPrint, FaReceipt } from "react-icons/fa";

type Item = {
  id: number;
  name: string;
  price: number;
  qty: number;
};

export default function NotaPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState<string>("");
  const [qty, setQty] = useState<string>("1");

  const addItem = () => {
    if (!name || !price || Number(price) <= 0 || Number(qty) <= 0) return;
    const next: Item = {
      id: Date.now(),
      name: name.trim(),
      price: Math.round(Number(price)),
      qty: Math.max(1, Math.round(Number(qty)))
    };
    setItems(prev => [next, ...prev]);
    setName("");
    setPrice("");
    setQty("1");
  };

  const removeItem = (id: number) => setItems(prev => prev.filter(i => i.id !== id));

  const subtotal = useMemo(() => items.reduce((s, it) => s + it.price * it.qty, 0), [items]);
  const tax = Math.round(subtotal * 0.0); // no tax by default
  const total = subtotal + tax;

  const handlePrint = () => {
    // Some browsers may need a short delay to reflow print-only elements
    setTimeout(() => window.print(), 150);
  };

  const formatRp = (n: number) => n.toLocaleString("id-ID");

  // Render current timestamp only on the client to avoid SSR/CSR hydration mismatch
  const [nowStr, setNowStr] = useState("");
  useEffect(() => {
    setNowStr(new Date().toLocaleString("id-ID"));
  }, []);

  return (
    <div className="space-y-6">
      <div className="max-w-md mx-auto">
        <div className="bg-white shadow rounded-lg p-6 mb-6 print-hidden">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <FaReceipt className="text-2xl" />
            </div>
            <h2 className="text-xl font-semibold">Buat Nota</h2>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Nama Barang</label>
              <input value={name} onChange={e => setName(e.target.value)} className="w-full p-2 border rounded" placeholder="Contoh: Ganti LCD" />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-sm font-medium mb-1">Harga (Rp)</label>
                <input value={price} onChange={e => setPrice(e.target.value)} inputMode="numeric" className="w-full p-2 border rounded" />
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-medium mb-1">Qty</label>
                <input value={qty} onChange={e => setQty(e.target.value)} inputMode="numeric" className="w-full p-2 border rounded" />
              </div>
              <div className="col-span-1 flex items-end">
                <button type="button" onClick={addItem} className="w-full bg-green-600 text-white rounded p-2 flex items-center justify-center gap-2">
                  <FaPlus /> Tambah
                </button>
              </div>
            </div>

            <div className="pt-2 border-t">
              <h3 className="text-sm font-medium mb-2">Daftar Item</h3>
              <div className="space-y-2 max-h-40 overflow-auto">
                {items.length === 0 && <p className="text-sm text-gray-500">Belum ada item</p>}
                {items.map(it => (
                  <div key={it.id} className="flex justify-between items-center gap-3">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{it.name}</div>
                      <div className="text-xs text-gray-600">Rp {formatRp(it.price)} x {it.qty}</div>
                    </div>
                    <div className="text-sm font-semibold">Rp {formatRp(it.price * it.qty)}</div>
                    <button onClick={() => removeItem(it.id)} className="ml-2 text-red-600 p-1 rounded hover:bg-red-50"><FaTrash /></button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={() => { setItems([]); }} className="flex-1 bg-gray-200 rounded p-2">Kosongkan</button>
              <button onClick={handlePrint} className="flex-1 bg-blue-600 text-white rounded p-2 flex items-center justify-center gap-2"><FaPrint /> Cetak Nota</button>
            </div>
          </div>
        </div>

        {/* Screen preview for the receipt (visible on screen, hidden when printing) */}
        <div className="bg-white p-4 mb-4 shadow-sm print:hidden" style={{ WebkitPrintColorAdjust: 'exact' as any, printColorAdjust: 'exact' as any }}>
          <div className="text-center mb-4">
            <div className="font-bold">Gadget Nusantara</div>
            <div className="text-xs">Jl. simpang - cikangkung</div>
            <div className="text-xs">Telp: 0858-6330-8655</div>
          </div>
          {/* divider between header and nota */}
          <div className="border-t border-gray-300 my-3" />

          <div className="text-[11px]">
            <div className="flex border-b pb-1">
              <div className="w-1/2 text-[11px]">Item</div>
              <div className="w-1/6 text-center text-[11px]">Jumlah</div>
              <div className="w-1/3 text-right text-[11px]">Subtotal</div>
            </div>

            {items.map(it => (
              <div key={it.id} className="flex justify-between items-start py-1">
                <div className="w-1/2 text-[11px]">{it.name}</div>
                <div className="w-1/6 text-center">{it.qty}</div>
                <div className="w-1/3 text-right">Rp {formatRp(it.price * it.qty)}</div>
              </div>
            ))}

            <div className="mt-2 border-t pt-2">
              <div className="flex text-[11px]"><div className="w-2/3">Subtotal</div><div className="w-1/3 text-right">Rp {formatRp(subtotal)}</div></div>
              <div className="flex text-[11px]"><div className="w-2/3">Tax</div><div className="w-1/3 text-right">Rp {formatRp(tax)}</div></div>
              <div className="flex text-[13px] font-semibold"><div className="w-2/3">Total</div><div className="w-1/3 text-right">Rp {formatRp(total)}</div></div>
            </div>

            <div className="mt-3 text-center text-[10px]">
              Tanggal: {nowStr}
            </div>

            <div className="mt-4 text-center text-[10px]">
              Terima kasih -- Barang yang sudah di service tidak dapat dikembalikan
            </div>
          </div>
        </div>

        {/* Printable receipt for 58mm */}
  <div className="print-only" style={{ WebkitPrintColorAdjust: 'exact' as any, printColorAdjust: 'exact' as any }}>
          <div className="text-center mb-4">
            <div className="font-bold">Gadget Nusantara</div>
            <div className="text-xs">Jl. simpang - cikangkung</div>
            <div className="text-xs">Telp: 0858-6330-8655</div>
          </div>
          {/* divider between header and nota (print) */}
          <div className="border-t border-black my-3" />

          <div className="text-[11px]">
            <div className="flex border-b pb-1">
              <div className="w-1/2 text-[11px]">Item</div>
              <div className="w-1/6 text-center text-[11px]">Jumlah</div>
              <div className="w-1/3 text-right text-[11px]">Subtotal</div>
            </div>

            {items.map(it => (
              <div key={it.id} className="flex justify-between items-start py-1">
                <div className="w-1/2 text-[11px]">{it.name}</div>
                <div className="w-1/6 text-center">{it.qty}</div>
                <div className="w-1/3 text-right">Rp {formatRp(it.price * it.qty)}</div>
              </div>
            ))}

            <div className="mt-2 border-t pt-2">
              <div className="flex text-[11px]"><div className="w-2/3">Subtotal</div><div className="w-1/3 text-right">Rp {formatRp(subtotal)}</div></div>
              <div className="flex text-[11px]"><div className="w-2/3">Tax</div><div className="w-1/3 text-right">Rp {formatRp(tax)}</div></div>
              <div className="flex text-[13px] font-semibold"><div className="w-2/3">Total</div><div className="w-1/3 text-right">Rp {formatRp(total)}</div></div>
            </div>

            <div className="mt-3 text-center text-[10px]">
              Tanggal: {nowStr}
            </div>

            <div className="mt-4 text-center text-[10px]">
              Terima kasih -- Barang yang sudah di service tidak dapat dikembalikan
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
