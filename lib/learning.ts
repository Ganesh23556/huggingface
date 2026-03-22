import { prisma } from "@/lib/prisma";

export async function getOrderedVideosForSubject(subjectId: number) {
  const sections = await prisma.section.findMany({
    where: { subjectId },
    orderBy: { orderIndex: "asc" },
    include: {
      videos: {
        orderBy: { orderIndex: "asc" },
      },
    },
  });

  return sections.flatMap((section) => section.videos);
}

export async function getVideoWithSubject(videoId: number) {
  return prisma.video.findUnique({
    where: { id: videoId },
    include: {
      section: {
        include: {
          subject: true,
        },
      },
    },
  });
}

export async function checkVideoLock(userId: number, videoId: number) {
  const currentVideo = await getVideoWithSubject(videoId);
  if (!currentVideo) return { locked: true, reason: "Video not found", currentVideo: null };

  const subjectId = currentVideo.section.subjectId;
  const orderedVideos = await getOrderedVideosForSubject(subjectId);
  const currentIndex = orderedVideos.findIndex((v) => v.id === videoId);

  if (currentIndex <= 0) return { locked: false, reason: null, currentVideo };

  const prevVideo = orderedVideos[currentIndex - 1];
  const prevProgress = await prisma.videoProgress.findUnique({
    where: { userId_videoId: { userId, videoId: prevVideo.id } },
  });

  if (!prevProgress?.isCompleted) {
    return {
      locked: true,
      reason: "Complete previous video",
      currentVideo,
      previousVideoId: prevVideo.id,
    };
  }

  return { locked: false, reason: null, currentVideo };
}
