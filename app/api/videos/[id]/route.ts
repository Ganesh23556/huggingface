export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { checkVideoLock } from "@/lib/learning";
import { forbidden, unauthorized } from "@/lib/http";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const user = await requireAuth();
  if (!user) return unauthorized();

  const videoId = Number(params.id);
  const lock = await checkVideoLock(user.userId, videoId);
  if (!lock.currentVideo) return NextResponse.json({ error: "Video not found" }, { status: 404 });

  try {
    const { prisma } = await import("@/lib/prisma");
    const enrolled = await prisma.enrollment.findUnique({
      where: {
        userId_subjectId: {
          userId: user.userId,
          subjectId: lock.currentVideo.section.subjectId,
        },
      },
    });

    if (!enrolled) return forbidden("Enroll first");

    const progress = await prisma.videoProgress.findUnique({
      where: { userId_videoId: { userId: user.userId, videoId } },
    });

    return NextResponse.json({
      video: lock.currentVideo,
      locked: lock.locked,
      lockReason: lock.reason,
      progress,
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
