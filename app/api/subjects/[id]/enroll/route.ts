export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { unauthorized } from "@/lib/http";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const user = await requireAuth();
  if (!user) return unauthorized();

  const subjectId = Number(params.id);
  
  try {
    const enrollment = await prisma.enrollment.upsert({
      where: { userId_subjectId: { userId: user.userId, subjectId } },
      create: { userId: user.userId, subjectId },
      update: {},
    });

    return NextResponse.json({ enrollment });
  } catch (error) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
