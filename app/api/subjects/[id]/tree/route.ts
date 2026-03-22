export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { notFound } from "@/lib/http";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);

  try {
    const subject = await prisma.subject.findUnique({
      where: { id },
      include: {
        sections: {
          orderBy: { orderIndex: "asc" },
          include: {
            videos: {
              orderBy: { orderIndex: "asc" },
            },
          },
        },
      },
    });

    if (!subject) return notFound("Subject not found");

    return NextResponse.json({ subject });
  } catch (error) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
