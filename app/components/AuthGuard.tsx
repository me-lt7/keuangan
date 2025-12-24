"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function AuthGuard() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let mounted = true;
    async function check() {
      try {
        const res = await fetch("/api/auth", { cache: "no-store" });
        const data = await res.json();
        if (!mounted) return;

        if (!data?.authenticated) {
          if (pathname !== "/login") router.replace("/login");
        } else {
          // if already logged in and on /login, send to root
          if (pathname === "/login") router.replace("/");
        }
      } catch (e) {
        if (!mounted) return;
        if (pathname !== "/login") router.replace("/login");
      }
    }

    check();
    return () => { mounted = false };
  }, [pathname, router]);

  return null;
}
