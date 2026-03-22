export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { unauthorized, badRequest } from "@/lib/http";

export async function POST(req: Request) {
  const user = await requireAuth();
  if (!user) return unauthorized();

  const { videoId } = await req.json();
  if (!videoId) return badRequest("videoId is required");

  const progress = await prisma.videoProgress.upsert({
    where: {
      userId_videoId: {
        userId: user.userId,
        videoId: Number(videoId),
      },
    },
    update: {
      isCompleted: true,
      completedAt: new Date(),
    },
    create: {
      userId: user.userId,
      videoId: Number(videoId),
      isCompleted: true,
      completedAt: new Date(),
    },
  });

  return NextResponse.json({ progress });
}
