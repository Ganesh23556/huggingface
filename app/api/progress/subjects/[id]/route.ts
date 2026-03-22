export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { unauthorized } from "@/lib/http";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const user = await requireAuth();
  if (!user) return unauthorized();

  const subjectId = Number(params.id);
  
  try {
    const { prisma } = await import("@/lib/prisma");
    const enrollment = await prisma.enrollment.findUnique({
      where: { userId_subjectId: { userId: user.userId, subjectId } },
    });
    if (!enrollment) return NextResponse.json({ progress: 0, completedLessons: 0, totalLessons: 0 });

    const videos = await prisma.video.findMany({
      where: { section: { subjectId } },
      select: { id: true },
    });

    const totalLessons = videos.length;
    if (totalLessons === 0) return NextResponse.json({ progress: 0, completedLessons: 0, totalLessons: 0 });

    const completedLessons = await prisma.videoProgress.count({
      where: {
        userId: user.userId,
        videoId: { in: videos.map((v) => v.id) },
        isCompleted: true,
      },
    });

    const progress = Math.round((completedLessons / totalLessons) * 100);
    return NextResponse.json({ progress, completedLessons, totalLessons });
  } catch (error) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
