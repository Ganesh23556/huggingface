export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { forbidden, notFound, unauthorized } from "@/lib/http";
import { getOrderedVideosForSubject } from "@/lib/learning";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const user = await requireAuth();
  if (!user) return unauthorized();

  const subjectId = Number(params.id);
  
  try {
    const { prisma } = await import("@/lib/prisma");
    const enrolled = await prisma.enrollment.findUnique({
      where: { userId_subjectId: { userId: user.userId, subjectId } },
    });
    if (!enrolled) return forbidden("Enroll first");

    const videos = await getOrderedVideosForSubject(subjectId);
    if (videos.length === 0) return notFound("No videos found");

    const progress = await prisma.videoProgress.findMany({
      where: { userId: user.userId, videoId: { in: videos.map((v) => v.id) } },
    });

    const completedMap = new Map(progress.map((p) => [p.videoId, p.isCompleted]));
    let firstUnlockedVideo = videos[0];
    for (let i = 1; i < videos.length; i += 1) {
      if (!completedMap.get(videos[i - 1].id)) {
        firstUnlockedVideo = videos[i - 1];
        break;
      }
      firstUnlockedVideo = videos[i];
    }

    return NextResponse.json({ firstUnlockedVideo });
  } catch (error) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
