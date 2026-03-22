export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { demoSubjects } from "@/lib/demo-data";

export async function GET() {
  if (!process.env.DATABASE_URL) {
    return new Response(
      JSON.stringify({ error: "Database not configured" }),
      { status: 500 }
    );
  }

  try {
    const subjects = await prisma.subject.findMany({
      where: { isPublished: true },
      select: {
        id: true,
        title: true,
        description: true,
        thumbnail: true,
        isPublished: true,
      },
      orderBy: { id: "desc" },
    });

    return NextResponse.json({ subjects });
  } catch {
    return NextResponse.json({
      subjects: demoSubjects,
      warning: "Running in demo mode. Configure DATABASE_URL to use MySQL data.",
    });
  }
}
