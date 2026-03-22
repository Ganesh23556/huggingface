"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/auth-store";

type Enrollment = {
  subject: {
    id: number;
    title: string;
    description: string;
    thumbnail?: string | null;
  };
};

type Stats = {
  totalEnrollments: number;
  completedLessons: number;
  studyHours: number;
  overallProgressPercentage: number;
};

export default function ProfilePage() {
  const { user, isLoading: authLoading, fetchMe } = useAuthStore();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    void fetchMe();
    void (async () => {
      try {
        const [enRes, stRes] = await Promise.all([
          fetch("/api/enrollments", { credentials: "include" }),
          fetch("/api/stats", { credentials: "include" })
        ]);
        const enData = await enRes.json();
        const stData = await stRes.json();
        setEnrollments(enData.enrollments || []);
        setStats(stData);
      } catch (err) {
        console.error("Failed to fetch dash data", err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [fetchMe]);

  if (authLoading || isLoading) return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
       <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
    </div>
  );
  if (!user) return <p>User not found.</p>;

  const activeEnrollments = enrollments.slice(0, 6); // Max 6 for the grid
  const resumeEnrollment = enrollments[0]; // Simple logic for resume

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Top Banner / Header Area */}
      <div className="h-48 w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500" />
      
      <div className="mx-auto -mt-24 max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          
          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="overflow-hidden rounded-3xl border border-white/40 bg-white/70 shadow-xl backdrop-blur-xl">
              <div className="p-6">
                <div className="flex flex-col items-center border-b border-slate-100 pb-6 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-2xl font-bold text-white shadow-lg shadow-indigo-200">
                    {user.name.charAt(0)}
                  </div>
                  <h2 className="mt-4 text-xl font-bold text-slate-900">{user.name}</h2>
                  <p className="text-xs font-medium text-slate-500">{user.email}</p>
                </div>
                
                <nav className="mt-6 space-y-1">
                  <Link href="/profile" className="flex items-center rounded-xl bg-indigo-50 px-4 py-3 text-sm font-bold text-indigo-700 transition-colors">
                    <span className="mr-3 text-lg">🏠</span> Overview
                  </Link>
                  <Link href="/courses" className="flex items-center rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900">
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
              <div className="bg-slate-50/50 p-6">
                <div className="rounded-2xl bg-white p-4 shadow-sm">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Next Live Class</p>
                  <p className="mt-1 text-xs font-semibold text-slate-900">System Design @ 3 PM</p>
                  <button className="mt-3 w-full rounded-lg bg-indigo-600 py-2 text-[11px] font-bold text-white transition-colors hover:bg-indigo-700">
                    Join Session
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <section className="space-y-8">
            {/* Welcome Message Card */}
            <div className="group relative overflow-hidden rounded-3xl bg-white p-8 shadow-xl shadow-slate-100 transition-all hover:shadow-2xl">
              <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-indigo-50/50 blur-3xl transition-colors group-hover:bg-indigo-100/50" />
              <div className="relative z-10">
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                  Welcome back, <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{user.name.split(' ')[0]}</span>! 👋
                </h1>
                <p className="mt-2 max-w-xl text-slate-500">
                  You've completed {stats?.overallProgressPercentage ?? 0}% of your journey. Keep the momentum going and achieve your goals today.
                </p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-6 sm:grid-cols-3">
              {[
                { label: 'Courses Enrolled', val: stats?.totalEnrollments ?? 0, icon: '📘', color: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100' },
                { label: 'Completed Lessons', val: stats?.completedLessons ?? 0, icon: '✅', color: 'bg-green-50', text: 'text-green-600', border: 'border-green-100' },
                { label: 'Study Hours', val: stats?.studyHours ?? 0, icon: '⚡', color: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100' },
              ].map((stat) => (
                <div key={stat.label} className={`rounded-3xl border ${stat.border} ${stat.color} p-6 shadow-sm transition-transform hover:scale-[1.02]`}>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{stat.icon}</span>
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${stat.text}`}>Stat</span>
                  </div>
                  <p className="mt-4 text-3xl font-black text-slate-900">{stat.val}</p>
                  <p className="text-xs font-semibold text-slate-500">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Resume Learning Card */}
            {resumeEnrollment ? (
              <div className="overflow-hidden rounded-3xl bg-slate-900 p-8 shadow-xl text-white">
                <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
                  <div className="space-y-4">
                    <div className="inline-block rounded-full bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-indigo-300">
                      Currently Learning
                    </div>
                    <h3 className="text-2xl font-bold">{resumeEnrollment.subject.title}</h3>
                    <p className="text-slate-400">Continue where you left off</p>
                    
                    <div className="w-full max-w-md space-y-2">
                       <div className="flex justify-between text-xs font-bold">
                         <span className="text-indigo-400">Progress</span>
                         <span>{(resumeEnrollment as any).progressPercentage ?? 0}%</span>
                       </div>
                       <div className="h-2 overflow-hidden rounded-full bg-white/10">
                         <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" style={{ width: `${(resumeEnrollment as any).progressPercentage ?? 0}%` }} />
                       </div>
                    </div>
                  </div>
                  
                  <Link
                    href={`/subjects/${resumeEnrollment.subject.id}`}
                    className="inline-flex items-center justify-center rounded-2xl bg-white px-8 py-4 text-sm font-black text-slate-900 transition-all hover:bg-slate-100 active:scale-95"
                  >
                    Continue Learning <span className="ml-2 text-lg">→</span>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-white/50 p-16 text-center shadow-inner">
                <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-slate-100/50 text-5xl">
                   📁
                </div>
                <h3 className="text-xl font-bold text-slate-900">No active enrollments</h3>
                <p className="mt-2 max-w-sm text-slate-500 font-medium">
                  You are not enrolled in any courses yet. Start your learning journey today with our curated tracks.
                </p>
                <Link 
                  href="/courses" 
                  className="mt-8 inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-10 py-4 text-sm font-black text-white shadow-lg shadow-indigo-200 transition-all hover:bg-slate-900 hover:shadow-xl active:scale-95"
                >
                  Explore Courses <span className="ml-2 text-lg">→</span>
                </Link>
              </div>
            )}

            {/* Active Enrollments Grid */}
            {activeEnrollments.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-xl font-bold text-slate-900">Your Active Courses</h3>
                  <Link href="/courses" className="text-xs font-bold text-indigo-600 hover:underline">View All</Link>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {activeEnrollments.map((en) => (
                    <div key={en.subject.id} className="group overflow-hidden rounded-3xl border border-slate-100 bg-white p-2 shadow-sm transition-all hover:shadow-lg hover:scale-[1.02]">
                      <div className="relative h-40 overflow-hidden rounded-2xl bg-slate-100">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4 text-white">
                          <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300">Active</p>
                          <p className="text-sm font-bold truncate">{en.subject.title}</p>
                        </div>
                      </div>
                      <div className="p-4 pt-4">
                         <div className="flex items-center justify-between">
                            <div className="flex-1">
                               <div className="flex items-center justify-between mb-1">
                                  <span className="text-[10px] font-bold text-slate-400">Progress</span>
                                  <span className="text-[10px] font-bold text-indigo-600">{(en as any).progressPercentage ?? 0}%</span>
                               </div>
                               <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${(en as any).progressPercentage ?? 0}%` }} />
                               </div>
                            </div>
                            <Link href={`/subjects/${en.subject.id}`} className="ml-4 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-400 transition-all group-hover:bg-indigo-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-indigo-100">
                              →
                            </Link>
                         </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Featured Courses (Instead of Suggested Mock) */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-xl font-bold text-slate-900">Featured Courses</h3>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-amber-600">Verified Tracks</span>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                {[
                  { title: "Advanced Cybersecurity", desc: "Protect systems from advanced threats.", color: "from-rose-500 to-red-600", icon: "🛡️" },
                  { title: "Blockchain & Web3", desc: "Build decentralized applications.", color: "from-blue-600 to-cyan-500", icon: "💎" },
                ].map((course) => (
                  <div key={course.title} className="group relative flex items-center gap-6 overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:shadow-xl">
                    <div className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${course.color} text-3xl shadow-lg shadow-slate-100`}>
                      {course.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900">{course.title}</h4>
                      <p className="mt-1 text-xs text-slate-500 line-clamp-1">{course.desc}</p>
                      <Link href="/courses" className="mt-3 inline-block text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-800">
                        Explore Now →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
