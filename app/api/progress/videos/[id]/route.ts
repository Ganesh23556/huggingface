export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { checkVideoLock } from "@/lib/learning";
import { forbidden, unauthorized } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { progressSchema } from "@/lib/validation";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const user = await requireAuth();
  if (!user) return unauthorized();

  const videoId = Number(params.id);
  
  try {
    const progress = await prisma.videoProgress.findUnique({
      where: { userId_videoId: { userId: user.userId, videoId } },
    });

    return NextResponse.json({ progress });
  } catch (error) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const user = await requireAuth();
  if (!user) return unauthorized();

  const videoId = Number(params.id);
  const lockState = await checkVideoLock(user.userId, videoId);
  if (lockState.locked) return forbidden("Complete previous video");

  const body = await request.json();
  const parsed = progressSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const payload = parsed.data;
  
  try {
    const progress = await prisma.videoProgress.upsert({
      where: { userId_videoId: { userId: user.userId, videoId } },
      create: {
        userId: user.userId,
        videoId,
        lastPositionSeconds: payload.last_position_seconds ?? 0,
        isCompleted: payload.is_completed ?? false,
        completedAt: payload.is_completed ? new Date() : null,
      },
      update: {
        lastPositionSeconds: payload.last_position_seconds,
        isCompleted: payload.is_completed ?? undefined,
        completedAt: payload.is_completed ? new Date() : undefined,
      },
    });

    return NextResponse.json({ progress });
  } catch (error) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
