"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);
    const payload = {
      email: String(formData.get("email") || ""),
      password: String(formData.get("password") || ""),
    };

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include",
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Login failed");
      return;
    }

    router.push("/profile");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 px-4 py-12">
      <div className="w-full max-w-4xl overflow-hidden rounded-3xl bg-white/90 shadow-2xl backdrop-blur-md md:flex">
        {/* Left Side: Branding/Visuals */}
        <section className="hidden w-1/2 flex-col justify-between bg-black/5 p-12 md:flex">
          <div>
            <h2 className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-4xl font-extrabold text-transparent">
              LMS Portal
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Unlock your potential with our expert-led courses.
            </p>
          </div>
          <div className="relative">
            <div className="absolute -left-4 -top-4 h-24 w-24 rounded-full bg-indigo-400/20 blur-2xl" />
            <div className="absolute -bottom-4 -right-4 h-32 w-32 rounded-full bg-purple-400/20 blur-2xl" />
            <div className="relative rounded-2xl border border-white/50 bg-white/40 p-6 shadow-sm backdrop-blur-sm">
              <p className="text-sm italic text-slate-700">
                "This platform changed my career path. The structured learning is top-notch!"
              </p>
              <p className="mt-2 text-xs font-bold text-slate-900">— Sarah J., Full Stack Student</p>
            </div>
          </div>
        </section>

        {/* Right Side: Login Form */}
        <section className="w-full p-8 md:w-1/2 md:p-12">
          <div className="mx-auto max-w-sm">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Welcome Back</h1>
            <p className="mt-2 text-sm text-slate-500">Please enter your details to sign in.</p>

            <form onSubmit={onSubmit} className="mt-8 space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Email Address</label>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Password</label>
                <input
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>

              {error ? (
                <div className="rounded-lg bg-red-50 p-3 text-xs font-medium text-red-600">
                  {error}
                </div>
              ) : null}

              <button className="group relative w-full overflow-hidden rounded-xl bg-slate-900 py-3.5 font-semibold text-white transition-all hover:bg-slate-800 active:scale-[0.98]">
                <span className="relative z-10">Sign In</span>
                <div className="absolute inset-0 translate-y-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-transform group-hover:translate-y-0" />
              </button>
            </form>

            <div className="mt-8 text-center text-sm">
              <span className="text-slate-500">Don't have an account?</span>{" "}
              <Link href="/register" className="font-bold text-indigo-600 hover:text-indigo-500">
                Create one for free
              </Link>
            </div>

            <div className="mt-6 rounded-xl border border-indigo-100 bg-indigo-50/50 p-3 text-center">
              <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">Demo Account</p>
              <p className="mt-1 text-xs text-indigo-700">demo@lms.com / demo123</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
