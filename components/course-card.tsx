"use client";

import Link from "next/link";

type CourseCardProps = {
  subjectId: number;
  videoId: number;
  title: string;
  youtubeVideoId: string;
  progress: number;
};

export function CourseCard({
  subjectId,
  videoId,
  title,
  youtubeVideoId,
  progress,
}: CourseCardProps) {
  const safeProgress = Math.max(0, Math.min(100, progress));
  const thumbnailUrl = `https://img.youtube.com/vi/${youtubeVideoId}/0.jpg`;

  return (
    <article className="overflow-hidden rounded-xl bg-white shadow-md transition hover:shadow-lg">
      <img src={thumbnailUrl} alt={title} className="h-44 w-full rounded-t-xl object-cover" />
      <div className="space-y-3 p-4">
        <h4 className="text-base font-semibold text-slate-900">{title}</h4>
        <div>
          <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
            <span>Progress</span>
            <span>{safeProgress}%</span>
          </div>
          <div className="h-2 rounded bg-slate-200">
            <div className="h-2 rounded bg-slate-900" style={{ width: `${safeProgress}%` }} />
          </div>
        </div>
        <Link
          href={`/subjects/${subjectId}/video/${videoId}`}
          className="inline-flex w-full items-center justify-center rounded-md bg-[#111827] px-4 py-2 text-sm font-medium text-white"
        >
          Continue
        </Link>
      </div>
    </article>
  );
}
