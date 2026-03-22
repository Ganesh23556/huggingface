export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { notFound } from "@/lib/http";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  if (!process.env.DATABASE_URL) {
    return new Response(
      JSON.stringify({ error: "Database not configured" }),
      { status: 500 }
    );
  }

  const id = Number(params.id);

  const subject = await prisma.subject.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      description: true,
      thumbnail: true,
      isPublished: true,
      _count: {
        select: {
          sections: true,
          enrollments: true,
        },
      },
    },
  });

  if (!subject) return notFound("Subject not found");

  return NextResponse.json({ subject });
}
