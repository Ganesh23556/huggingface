"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";

export function Header() {
  const { user, fetchMe, logout } = useAuthStore();

  useEffect(() => {
    void fetchMe();
  }, [fetchMe]);

  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-semibold text-slate-900">
          LMS Portal
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          {user ? (
            <>
              <Link href="/profile" className="text-slate-700 hover:text-slate-900">
                {user.name}
              </Link>
              <button
                onClick={() => void logout()}
                className="rounded bg-slate-900 px-3 py-1.5 text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-slate-700 hover:text-slate-900">
                Login
              </Link>
              <Link href="/register" className="rounded bg-slate-900 px-3 py-1.5 text-white">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
