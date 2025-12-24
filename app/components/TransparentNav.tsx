"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiHome, FiList, FiMenu, FiX, FiFileText } from "react-icons/fi";
import { useState } from "react";

export default function TransparentNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => pathname === href;

  return (
     <div className="fixed left-1/2 top-4 z-50 w-full max-w-3xl -translate-x-1/2 px-4 print:hidden">
      <div className="mx-auto">
        <div className="relative">
          <div className="flex items-center justify-between gap-4 bg-black/60 backdrop-blur-md border border-black/30 text-white rounded-2xl px-4 py-2 shadow-lg">
            <div className="flex items-center gap-3">
              <Link href="/" className="inline-flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                  <FiHome className="text-white" />
                </div>
                <div className="hidden sm:block font-semibold tracking-wide">Catatan Keuangan</div>
              </Link>
            </div>

            <div className="hidden sm:flex items-center gap-2">
              <Link
                href="/"
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-md transition ${
                  isActive('/') ? 'bg-white/10 text-white' : 'text-white/90 hover:bg-white/10'
                }`}
              >
                <FiHome /> <span>Home</span>
              </Link>

              <Link
                href="/history"
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-md transition ${
                  isActive('/history') ? 'bg-white/10 text-white' : 'text-white/90 hover:bg-white/10'
                }`}
              >
                <FiList /> <span>History</span>
              </Link>

              <Link
                href="/print-nota"
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-md transition ${
                  isActive('/print-nota') ? 'bg-white/10 text-white' : 'text-white/90 hover:bg-white/10'
                }`}
              >
                <FiFileText /> <span>Nota</span>
              </Link>

              <Link
                href="/print-garansi"
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-md transition ${
                  isActive('/print-garansi') ? 'bg-white/10 text-white' : 'text-white/90 hover:bg-white/10'
                }`}
              >
                <FiFileText /> <span>Garansi</span>
              </Link>
            </div>

            <div className="sm:hidden">
              <button
                onClick={() => setOpen(!open)}
                aria-label="Toggle menu"
                className="p-2 rounded-md text-white/90 bg-white/5 hover:bg-white/10"
              >
                {open ? <FiX /> : <FiMenu />}
              </button>
            </div>
          </div>

          {open && (
            <div className="mt-2 bg-black/70 backdrop-blur-sm rounded-lg p-3 border border-black/25 text-white">
              <div className="flex flex-col gap-2">
                <Link href="/" className={`px-3 py-2 rounded ${isActive('/') ? 'bg-white/10' : 'hover:bg-white/5'}`} onClick={() => setOpen(false)}>
                  Home
                </Link>
                <Link href="/history" className={`px-3 py-2 rounded ${isActive('/history') ? 'bg-white/10' : 'hover:bg-white/5'}`} onClick={() => setOpen(false)}>
                  History
                </Link>
                <Link href="/print-nota" className={`px-3 py-2 rounded ${isActive('/print-nota') ? 'bg-white/10' : 'hover:bg-white/5'}`} onClick={() => setOpen(false)}>
                  Nota
                </Link>
                <Link href="/print-garansi" className={`px-3 py-2 rounded ${isActive('/print-garansi') ? 'bg-white/10' : 'hover:bg-white/5'}`} onClick={() => setOpen(false)}>
                  Garansi
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
