"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiHome, FiList, FiMenu, FiX } from "react-icons/fi";
import { useState } from "react";

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const NavLink = ({ href, children, icon }: { href: string; children: React.ReactNode; icon: React.ReactNode }) => {
    const active = pathname === href;
    return (
      <Link
        href={href}
        className={`inline-flex items-center gap-2 px-3 py-2 rounded-md transition-colors duration-150 ${
          active ? "bg-white/20 text-white" : "text-white/90 hover:bg-white/5"
        }`}
        onClick={() => setOpen(false)}
      >
        {icon}
        <span className="hidden sm:inline">{children}</span>
      </Link>
    );
  };

  return (
    <nav className="w-full">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-9 h-9 rounded-md flex items-center justify-center bg-white/20 backdrop-blur-sm">
                <FiHome className="text-white" />
              </div>
            </Link>
            <div className="hidden sm:block text-white/95 font-semibold tracking-wide">Catatan Keuangan</div>
          </div>

          {/* Desktop links */}
          <div className="hidden sm:flex items-center gap-2">
            <NavLink href="/" icon={<FiHome />}>Home</NavLink>
            <NavLink href="/history" icon={<FiList />}>History</NavLink>
          </div>

          {/* Mobile menu button */}
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

        {/* Mobile dropdown */}
        {open && (
          <div className="sm:hidden mt-2 bg-white/6 backdrop-blur-sm rounded-lg p-3">
            <div className="flex flex-col gap-2">
              <Link href="/" className={`px-3 py-2 rounded ${pathname === '/' ? 'bg-white/10 text-white' : 'text-white/90 hover:bg-white/5'}`} onClick={() => setOpen(false)}>
                Home
              </Link>
              <Link href="/history" className={`px-3 py-2 rounded ${pathname === '/history' ? 'bg-white/10 text-white' : 'text-white/90 hover:bg-white/5'}`} onClick={() => setOpen(false)}>
                History
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
