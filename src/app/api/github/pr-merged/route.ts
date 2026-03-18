import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

// Webhook endpoint: called by GitHub Actions when a PR is merged
export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-webhook-secret");
  if (secret !== process.env.WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { prNumber, repoOwner, repoName, action } = await req.json();

  if (action !== "merged") {
    return NextResponse.json({ ok: true, skipped: true });
  }

  const graduation = await prisma.graduationPR.findFirst({
    where: { prNumber, repoOwner, repoName, status: "pending" },
  });

  if (!graduation) {
    return NextResponse.json({ error: "找不到对应的毕业记录" }, { status: 404 });
  }

  await prisma.graduationPR.update({
    where: { id: graduation.id },
    data: {
      status: "merged",
      mergedAt: new Date(),
    },
  });

  // Auto-trigger refund check
  const order = await prisma.order.findFirst({
    where: { userId: graduation.userId, status: "paid" },
  });

  if (order) {
    // Check all levels completed
    const completedCount = await prisma.progress.count({
      where: { userId: graduation.userId, completed: true },
    });

    // 20 levels total
    if (completedCount >= 20) {
      // TODO: call payment gateway refund API
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: "refunded",
          refundedAt: new Date(),
        },
      });
    }
  }

  return NextResponse.json({ ok: true, graduated: true });
}
