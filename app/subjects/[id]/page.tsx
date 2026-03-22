"use client";

import { useEffect, useState } from "react";

type Subject = {
  id: number;
  title: string;
  description: string;
  _count: { sections: number; enrollments: number };
};

export default function SubjectPage({ params }: { params: { id: string } }) {
  const [subject, setSubject] = useState<Subject | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    void (async () => {
      const res = await fetch(`/api/subjects/${params.id}`, { credentials: "include" });
      const data = await res.json();
      setSubject(data.subject);
    })();
  }, [params.id]);

  async function enroll() {
    const res = await fetch(`/api/subjects/${params.id}/enroll`, { method: "POST", credentials: "include" });
    if (!res.ok) {
      setMessage("Unable to enroll");
      return;
    }
    setMessage("Enrolled successfully. Start learning now.");
  }

  if (!subject) return <p>Loading...</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{subject.title}</h1>
      <p className="text-slate-600">{subject.description}</p>
      <p className="text-sm text-slate-500">Sections: {subject._count.sections}</p>
      <button onClick={enroll} className="rounded bg-slate-900 px-4 py-2 text-white">
        Enroll
      </button>
      {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
    </div>
  );
}
