export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { unauthorized } from "@/lib/http";

export async function GET() {
  const user = await requireAuth();
  if (!user) return unauthorized();

  const userId = user.userId;

  // 1. Total Enrollments
  const totalEnrollments = await prisma.enrollment.count({
    where: { userId },
  });

  // 2. Completed Lessons
  const completedLessons = await prisma.videoProgress.count({
    where: {
      userId,
      isCompleted: true,
    },
  });

  // 3. Study Hours (Total duration of completed videos in hours)
  const completedProgress = await prisma.videoProgress.findMany({
    where: {
      userId,
      isCompleted: true,
    },
    include: {
      video: {
        select: {
          durationSeconds: true,
        },
      },
    },
  });

  const totalSeconds = completedProgress.reduce((sum, p) => sum + (p.video?.durationSeconds || 0), 0);
  // Also add partial progress from currently watched videos
  const partialProgress = await prisma.videoProgress.findMany({
    where: {
      userId,
      isCompleted: false,
    },
    select: {
      lastPositionSeconds: true,
    },
  });
  const partialSeconds = partialProgress.reduce((sum, p) => sum + (p.lastPositionSeconds || 0), 0);
  
  const studyHours = parseFloat(((totalSeconds + partialSeconds) / 3600).toFixed(1));

  // 4. Overall Progress Percentage
  const allEnrolledSubjects = await prisma.enrollment.findMany({
    where: { userId },
    include: { subject: { include: { sections: { include: { videos: { select: { id: true } } } } } } }
  });

  const allVideoIds = allEnrolledSubjects.flatMap(en => 
    en.subject.sections.flatMap(s => s.videos.map(v => v.id))
  );
  
  const totalLessons = allVideoIds.length;
  const overallProgressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return NextResponse.json({
    totalEnrollments,
    completedLessons,
    studyHours,
    overallProgressPercentage,
  });
}
