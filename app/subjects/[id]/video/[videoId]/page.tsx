"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { VideoPlayer } from "@/components/video-player";
import { useLearningStore } from "@/store/learning-store";

type TreeResponse = {
  subject: {
    id: number;
    title: string;
    sections: Array<{
      id: number;
      title: string;
      videos: Array<{ id: number; title: string; orderIndex: number }>;
    }>;
  };
};

type VideoResponse = {
  video?: {
    id: number;
    title: string;
    youtubeUrl: string;
  };
  locked: boolean;
  lockReason?: string;
};

export default function LearningPage({ params }: { params: { id: string; videoId: string } }) {
  const [tree, setTree] = useState<TreeResponse | null>(null);
  const [videoData, setVideoData] = useState<VideoResponse | null>(null);
  const [progress, setProgress] = useState(0);
  const [progressJson, setProgressJson] = useState<any>(null);
  const setContext = useLearningStore((state) => state.setContext);

  useEffect(() => {
    if (tree && videoData?.video) {
      setContext(tree.subject.title, videoData.video.title);
    }
  }, [tree, videoData, setContext]);

  useEffect(() => {
    let isMounted = true;
    void (async () => {
      try {
        const [treeRes, videoRes, progressRes] = await Promise.all([
          fetch(`/api/subjects/${params.id}/tree`, { credentials: "include" }),
          fetch(`/api/videos/${params.videoId}`, { credentials: "include" }),
          fetch(`/api/progress/subjects/${params.id}`, { credentials: "include" }),
        ]);

        if (!isMounted) return;

        if (!treeRes.ok || !videoRes.ok) {
          throw new Error("Failed to load lesson data");
        }

        const treeJson = await treeRes.json();
        const videoJson = await videoRes.json();
        const progressData = await progressRes.json();

        setTree(treeJson);
        setVideoData(videoJson);
        setProgress(progressData.progress ?? 0);
        setProgressJson(progressData);
      } catch (err) {
        console.error("Learning page error:", err);
        if (isMounted) {
          setVideoData({ locked: false, lockReason: "Error loading video" } as any);
        }
      }
    })();
    return () => { isMounted = false; };
  }, [params.id, params.videoId]);

  const flatVideos = useMemo(() => {
    return tree?.subject.sections.flatMap((s) => s.videos) ?? [];
  }, [tree]);

  const currentIndex = flatVideos.findIndex((v) => v.id === Number(params.videoId));
  const prevVideo = currentIndex > 0 ? flatVideos[currentIndex - 1] : null;
  const nextVideo = currentIndex >= 0 && currentIndex < flatVideos.length - 1 ? flatVideos[currentIndex + 1] : null;

  if (!tree || !videoData) return <p>Loading...</p>;

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <aside className="rounded-lg border bg-white p-4">
        {tree.subject.sections.map((section) => (
          <div key={section.id} className="mb-4">
            <h3 className="font-semibold">{section.title}</h3>
            <div className="mt-2 space-y-2">
              {section.videos.map((video) => (
                <Link
                  key={video.id}
                  href={`/subjects/${params.id}/video/${video.id}`}
                  className={`block rounded border p-2 text-sm ${video.id === Number(params.videoId) ? "border-slate-900" : "border-slate-200"}`}
                >
                  {video.title}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </aside>

      <section className="space-y-4">
        {videoData.locked ? (
          <div className="rounded-lg border bg-amber-50 p-4 text-amber-700">Complete previous video</div>
        ) : (
          <VideoPlayer youtubeUrl={videoData.video?.youtubeUrl || ""} />
        )}

        <div className="rounded-lg border bg-white p-4">
          <h1 className="text-xl font-semibold">{videoData.video?.title || "Lesson"}</h1>
          <div className="mt-4">
            <div className="mb-1 text-sm text-slate-600">Progress: {progress}%</div>
            <div className="h-2 rounded bg-slate-200">
              <div className="h-2 rounded bg-slate-900" style={{ width: `${progress}%` }} />
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {!progressJson?.isCompleted && (
              <button
                onClick={async () => {
                  const res = await fetch("/api/progress", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ videoId: params.videoId }),
                    credentials: "include",
                  });
                  if (res.ok) {
                    window.location.reload();
                  }
                }}
                className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
              >
                Mark as Completed
              </button>
            )}
            {prevVideo ? (
              <Link className="rounded border px-4 py-2 hover:bg-slate-50" href={`/subjects/${params.id}/video/${prevVideo.id}`}>
                Previous
              </Link>
            ) : null}
            {nextVideo ? (
              <Link className="rounded bg-slate-900 px-4 py-2 text-white hover:bg-slate-800" href={`/subjects/${params.id}/video/${nextVideo.id}`}>
                Next
              </Link>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}
