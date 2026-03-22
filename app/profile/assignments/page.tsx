"use client";

"use client";

import Link from "next/link";
import { useState } from "react";

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState([
    { 
      id: 1, 
      title: "Interactive Web App - Final Project", 
      subject: "Full Stack Web Development", 
      due: "Mar 30, 2026", 
      status: "Pending", 
      color: "from-blue-500 to-indigo-600",
      question: "Describe the architectural pattern used in your project (e.g., MVC, Microservices) and why you chose it."
    },
    { 
      id: 2, 
      title: "Algorithm Analysis Report", 
      subject: "Data Structures and Algorithms", 
      due: "Apr 05, 2026", 
      status: "Pending", 
      color: "from-purple-500 to-pink-600",
      question: "Compare the time complexity of QuickSort vs MergeSort in the worst-case scenario."
    },
    { 
      id: 3, 
      title: "Dockerizing a Microservice", 
      subject: "Cloud and DevOps Foundations", 
      due: "Mar 25, 2026", 
      status: "Submitted", 
      color: "from-cyan-500 to-blue-600",
      question: "What are the benefits of multi-stage builds in Docker?"
    },
  ]);

  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [errorIds, setErrorIds] = useState<number[]>([]);

  const handleSubmit = (id: number) => {
    if (!answers[id]?.trim()) {
      setErrorIds(prev => [...prev, id]);
      setTimeout(() => setErrorIds(prev => prev.filter(eid => eid !== id)), 3000);
      return;
    }
    setAssignments(prev => prev.map(a => a.id === id ? { ...a, status: "Submitted" } : a));
    setErrorIds(prev => prev.filter(eid => eid !== id));
  };

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
                  <Link href="/profile/courses" className="flex items-center rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900">
                    <span className="mr-3 text-lg">📚</span> My Courses
                  </Link>
                  <Link href="/profile/assignments" className="flex items-center rounded-xl bg-indigo-50 px-4 py-3 text-sm font-bold text-indigo-700 transition-colors">
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
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Assignments</h1>
              <p className="mt-2 text-slate-500">Track and submit your coursework.</p>

              <div className="mt-8 grid gap-10">
                {assignments.map((a) => (
                  <div key={a.id} className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-8 shadow-sm transition-all hover:shadow-md">
                    <div className={`absolute left-0 top-0 h-full w-2 bg-gradient-to-b ${a.color}`} />
                    
                    <div className="flex flex-col gap-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-3">
                            <h3 className="text-xl font-bold text-slate-900">{a.title}</h3>
                            <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest ${
                              a.status === 'Submitted' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
                            }`}>
                              {a.status}
                            </span>
                          </div>
                          <p className="mt-1 text-xs font-semibold text-slate-500">{a.subject}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 font-mono">Due Date</p>
                          <p className="text-sm font-bold text-slate-800">{a.due}</p>
                        </div>
                      </div>

                      <div className="rounded-2xl bg-slate-50 p-6 border border-slate-100">
                         <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 mb-2">Assignment Question</p>
                         <p className="text-sm font-medium text-slate-700 leading-relaxed">{a.question}</p>
                      </div>

                      {a.status === 'Pending' ? (
                        <div className="space-y-4">
                          <textarea 
                            placeholder="Type your answer here..."
                            value={answers[a.id] || ""}
                            onChange={(e) => setAnswers({ ...answers, [a.id]: e.target.value })}
                            className="w-full min-h-[120px] rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5"
                          />
                          <div className="flex flex-col items-end gap-3">
                            {errorIds.includes(a.id) && (
                              <p className="text-xs font-bold text-rose-500 animate-bounce">
                                ⚠️ Please type an answer before submitting!
                              </p>
                            )}
                            <button 
                              onClick={() => handleSubmit(a.id)}
                              className="rounded-2xl bg-indigo-600 px-8 py-4 text-sm font-bold text-white transition-all hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-100 active:scale-95"
                            >
                              Submit Final Answer
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="rounded-2xl bg-green-50/50 p-4 border border-green-100">
                          <p className="text-sm font-bold text-green-700 flex items-center">
                            <span className="mr-2">🎉</span> Success! This assignment has been submitted.
                          </p>
                        </div>
                      )}
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
