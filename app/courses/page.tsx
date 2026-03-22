"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";

type Subject = {
  id: number;
  title: string;
  description: string;
  thumbnail?: string | null;
};

export default function CoursesPage() {
  const router = useRouter();
  const { user, isLoading: authLoading, fetchMe } = useAuthStore();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState<number | null>(null);

  useEffect(() => {
    void fetchMe();
    void (async () => {
      try {
        const res = await fetch("/api/subjects", { credentials: "include" });
        const data = await res.json();
        setSubjects(data.subjects || []);
      } catch (err) {
        console.error("Failed to fetch subjects", err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [fetchMe]);

  const handleEnroll = async (subjectId: number) => {
    if (!user) {
      router.push("/login?next=/courses");
      return;
    }

    setEnrollingId(subjectId);
    try {
      const res = await fetch("/api/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subjectId }),
        credentials: "include",
      });

      if (res.ok) {
        router.push("/profile");
      } else {
        const data = await res.json();
        alert(data.error || "Failed to enroll");
      }
    } catch (err) {
      console.error("Enrollment error:", err);
      alert("An error occurred during enrollment.");
    } finally {
      setEnrollingId(null);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Explore <span className="text-indigo-600">Our Courses</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-500">
            Discover premium learning paths designed to help you master new skills and advance your career.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject) => (
            <div
              key={subject.id}
              className="group flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition-all hover:scale-[1.02] hover:shadow-xl"
            >
              <div className="relative h-48 w-full bg-slate-200">
                {subject.thumbnail ? (
                  <img
                    src={subject.thumbnail}
                    alt={subject.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
                    <span className="text-5xl">📚</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              </div>

              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-xl font-bold text-slate-900">{subject.title}</h3>
                <p className="mt-2 flex-1 text-sm text-slate-500 line-clamp-3">
                  {subject.description}
                </p>
                <div className="mt-6">
                  <button
                    onClick={() => handleEnroll(subject.id)}
                    disabled={enrollingId === subject.id}
                    className="flex w-full items-center justify-center rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-slate-900 disabled:opacity-50"
                  >
                    {enrollingId === subject.id ? "Enrolling..." : "Enroll Now →"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {subjects.length === 0 && (
          <div className="mt-20 text-center">
            <p className="text-xl text-slate-400">No courses available at the moment.</p>
          </div>
        )}
        
        <div className="mt-16 text-center">
          <Link href="/profile" className="text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors">
             ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
