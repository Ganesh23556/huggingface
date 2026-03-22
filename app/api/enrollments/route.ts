export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { unauthorized } from "@/lib/http";

export async function GET() {
  const user = await requireAuth();
  if (!user) return unauthorized();

  const enrollmentsData = await prisma.enrollment.findMany({
    where: { userId: user.userId },
    include: {
      subject: {
        include: {
          sections: {
            include: {
              videos: {
                select: { id: true }
              }
            }
          }
        }
      }
    },
  });

  const enrollments = await Promise.all(enrollmentsData.map(async (en) => {
    const allVideoIds = en.subject.sections.flatMap(s => s.videos.map(v => v.id));
    const totalVideos = allVideoIds.length;
    
    const completedVideosCount = await prisma.videoProgress.count({
      where: {
        userId: user.userId,
        videoId: { in: allVideoIds },
        isCompleted: true
      }
    });

    const progressPercentage = totalVideos > 0 ? Math.round((completedVideosCount / totalVideos) * 100) : 0;

    return {
      subject: {
        id: en.subject.id,
        title: en.subject.title,
        description: en.subject.description,
        thumbnail: en.subject.thumbnail,
      },
      progressPercentage
    };
  }));

  return NextResponse.json({ enrollments });
}

export async function POST(request: Request) {
  const user = await requireAuth();
  if (!user) return unauthorized();

  try {
    const { subjectId } = await request.json();
    if (!subjectId) {
      return NextResponse.json({ error: "Subject ID is required" }, { status: 400 });
    }

    const sid = parseInt(subjectId);

    // Check if subject exists
    const subject = await prisma.subject.findUnique({
      where: { id: sid },
    });

    if (!subject) {
      return NextResponse.json({ error: "Subject not found" }, { status: 404 });
    }

    // Check if already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_subjectId: {
          userId: user.userId,
          subjectId: sid,
        },
      },
    });

    if (existingEnrollment) {
      return NextResponse.json({ message: "Already enrolled" });
    }

    const enrollment = await prisma.enrollment.create({
      data: {
        userId: user.userId,
        subjectId: sid,
      },
    });

    // Return success
    return NextResponse.json({ 
      success: true, 
      enrollment, 
      message: "Enrolled successfully" 
    });
  } catch (err: any) {
    console.error("Enrollment error:", err);
    return NextResponse.json({ 
      success: false, 
      error: err.message || "Failed to process enrollment" 
    }, { status: 500 });
  }
}
