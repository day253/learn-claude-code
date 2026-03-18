import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const progress = await prisma.progress.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json({
    completedLevels: progress.filter((p) => p.completed).map((p) => p.levelId),
    checkpointStates: Object.fromEntries(
      progress.map((p) => [
        p.levelId,
        p.checkpointData ? JSON.parse(p.checkpointData) : {},
      ]),
    ),
  });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const { levelId, completed, checkpointData } = await req.json();

  if (!levelId) {
    return NextResponse.json({ error: "缺少 levelId" }, { status: 400 });
  }

  await prisma.progress.upsert({
    where: {
      userId_levelId: { userId: user.id, levelId },
    },
    create: {
      userId: user.id,
      levelId,
      completed: completed || false,
      checkpointData: checkpointData ? JSON.stringify(checkpointData) : null,
      completedAt: completed ? new Date() : null,
    },
    update: {
      completed: completed || false,
      checkpointData: checkpointData ? JSON.stringify(checkpointData) : null,
      completedAt: completed ? new Date() : null,
    },
  });

  return NextResponse.json({ ok: true });
}
