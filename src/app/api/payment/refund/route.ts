import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const order = await prisma.order.findFirst({
    where: { userId: user.id, status: "paid" },
  });

  if (!order) {
    return NextResponse.json({ error: "没有可退款的订单" }, { status: 400 });
  }

  // Check graduation: all levels completed + PR merged
  const allProgress = await prisma.progress.findMany({
    where: { userId: user.id, completed: true },
  });

  const graduationPR = await prisma.graduationPR.findFirst({
    where: { userId: user.id, status: "merged" },
  });

  if (!graduationPR) {
    return NextResponse.json(
      { error: "需要完成毕业挑战并提交合格 PR 才能返现" },
      { status: 400 },
    );
  }

  // TODO: call payment gateway refund API
  // For WeChat: POST /v3/refund/domestic/refunds
  // For Alipay: alipay.trade.refund

  await prisma.order.update({
    where: { id: order.id },
    data: {
      status: "refunded",
      refundedAt: new Date(),
    },
  });

  return NextResponse.json({
    ok: true,
    message: "退款申请已提交，预计 1-3 个工作日到账",
    completedLevels: allProgress.length,
  });
}
