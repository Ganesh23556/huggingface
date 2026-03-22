"use client";

type Props = {
  youtubeUrl: string;
};

function extractYouTubeVideoId(youtubeUrl: string) {
  if (!youtubeUrl) return "";

  try {
    const url = new URL(youtubeUrl);

    if (url.hostname.includes("youtu.be")) {
      return url.pathname.replace("/", "");
    }

    if (url.hostname.includes("youtube.com")) {
      if (url.pathname.includes("/embed/")) {
        return url.pathname.split("/embed/")[1] ?? "";
      }
      return url.searchParams.get("v") ?? "";
    }
  } catch {
    // Fallback to regex parsing when URL parsing fails.
  }

  const embedMatch = youtubeUrl.match(/embed\/([^?&/]+)/);
  if (embedMatch) return embedMatch[1];

  const watchMatch = youtubeUrl.match(/[?&]v=([^?&/]+)/);
  if (watchMatch) return watchMatch[1];

  return "";
}

export function VideoPlayer({ youtubeUrl }: Props) {
  const videoId = extractYouTubeVideoId(youtubeUrl);
  const src = `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1`;

  return (
    <div className="aspect-video overflow-hidden rounded-xl">
      <iframe
        className="h-full w-full rounded-lg"
        src={src}
        title="Course video player"
        allow="autoplay; encrypted-media"
        allowFullScreen
      />
    </div>
  );
}
