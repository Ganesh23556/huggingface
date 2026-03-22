"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth-store";

type Enrollment = {
  subject: {
    id: number;
    title: string;
    description: string;
  };
};

export default function MyCoursesPage() {
  const { user, fetchMe } = useAuthStore();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    void fetchMe();
    void (async () => {
      try {
        const res = await fetch("/api/enrollments", { credentials: "include" });
        const data = await res.json();
        setEnrollments(data.enrollments || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [fetchMe]);

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="h-48 w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500" />
      
      <div className="mx-auto -mt-24 max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          
          <aside className="space-y-6">
            <div className="overflow-hidden rounded-3xl border border-white/40 bg-white/70 shadow-xl backdrop-blur-xl">
              <div className="p-6">
                <nav className="space-y-1">
                  <Link href="/profile" className="flex items-center rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900">
                    <span className="mr-3 text-lg">🏠</span> Overview
                  </Link>
                  <Link href="/profile/courses" className="flex items-center rounded-xl bg-indigo-50 px-4 py-3 text-sm font-bold text-indigo-700 transition-colors">
                    <span className="mr-3 text-lg">📚</span> My Courses
                  </Link>
                  <Link href="/profile/assignments" className="flex items-center rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900">
                    <span className="mr-3 text-lg">📝</span> Assignments
                  </Link>
                  <Link href="/profile/messages" className="flex items-center rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900">
                    <span className="mr-3 text-lg">💬</span> Messages
                  </Link>
                </nav>
              </div>
            </div>
          </aside>

          <section className="space-y-8">
            <div className="rounded-3xl bg-white p-8 shadow-xl shadow-slate-100">
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">My Courses</h1>
              <p className="mt-2 text-slate-500">Continue your learning progress.</p>

              {isLoading ? (
                <div className="mt-8 flex justify-center py-20">
                  <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
                </div>
              ) : enrollments.length === 0 ? (
                <div className="mt-8 flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-16 text-center shadow-inner">
                  <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-white/70 text-5xl backdrop-blur-sm">
                     📚
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Your library is empty</h3>
                  <p className="mt-2 max-w-sm text-slate-500 font-medium">
                    You are not enrolled in any courses yet. Explore our courses to find something you like.
                  </p>
                  <Link 
                    href="/courses" 
                    className="mt-8 inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-10 py-4 text-sm font-black text-white shadow-lg shadow-indigo-200 transition-all hover:bg-slate-900 hover:shadow-xl active:scale-95"
                  >
                    Explore Courses <span className="ml-2 text-lg">→</span>
                  </Link>
                </div>
              ) : (
                <div className="mt-8 grid gap-6 md:grid-cols-2">
                  {enrollments.map((e) => (
                    <div key={e.subject.id} className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:shadow-xl hover:scale-[1.02]">
                      <div className="flex flex-col justify-between h-full">
                        <div>
                          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-2xl">
                             📘
                          </div>
                          <h3 className="text-xl font-bold text-slate-900">{e.subject.title}</h3>
                          <p className="mt-2 text-sm font-medium text-slate-500 line-clamp-2">{e.subject.description}</p>
                        </div>
                        <Link
                          href={`/subjects/${e.subject.id}`}
                          className="mt-8 inline-flex items-center text-sm font-black text-indigo-600 hover:text-indigo-700"
                        >
                          Go to Course <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
