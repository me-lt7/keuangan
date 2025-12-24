"use client";

export default function GradientBackground() {
  return (
    <div aria-hidden className="fixed inset-0 -z-20 pointer-events-none overflow-hidden print:hidden">
      {/* Left top blob */}
      <div className="absolute -left-40 -top-24 w-[520px] h-[520px] rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-30 blur-3xl animate-blob" />

      {/* Right bottom blob */}
      <div className="absolute -right-36 -bottom-20 w-[440px] h-[440px] rounded-full bg-gradient-to-tr from-emerald-300 via-teal-400 to-cyan-500 opacity-25 blur-3xl animate-blob animation-delay-2000" />

      {/* Subtle radial */}
      <div className="absolute inset-0 bg-gradient-radial opacity-10 mix-blend-overlay" />
    </div>
  );
}
