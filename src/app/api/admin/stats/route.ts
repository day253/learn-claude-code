import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Simple admin check — in production, use proper role-based auth
const ADMIN_PHONES = (process.env.ADMIN_PHONES || "").split(",").filter(Boolean);

export async function GET() {
  const user = await getCurrentUser();
  if (!user || !ADMIN_PHONES.includes(user.phone || "")) {
    return NextResponse.json({ error: "无权限" }, { status: 403 });
  }

  const totalUsers = await prisma.user.count();
  const paidOrders = await prisma.order.count({ where: { status: "paid" } });
  const refundedOrders = await prisma.order.count({
    where: { status: "refunded" },
  });
  const graduations = await prisma.graduationPR.count({
    where: { status: "merged" },
  });

  const revenue = paidOrders * 990 + refundedOrders * 990;

  const users = await prisma.user.findMany({
    include: {
      progress: { where: { completed: true } },
      orders: { take: 1, orderBy: { createdAt: "desc" } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const graduatedUserIds = new Set(
    (
      await prisma.graduationPR.findMany({
        where: { status: "merged" },
        select: { userId: true },
      })
    ).map((g: { userId: string }) => g.userId),
  );

  const refundedUserIds = new Set(
    (
      await prisma.order.findMany({
        where: { status: "refunded" },
        select: { userId: true },
      })
    ).map((o: { userId: string }) => o.userId),
  );

  return NextResponse.json({
    stats: {
      totalUsers,
      paidUsers: paidOrders + refundedOrders,
      completedUsers: graduations,
      refundedUsers: refundedOrders,
      revenue,
      completionRate:
        paidOrders + refundedOrders > 0
          ? Math.round(
              (graduations / (paidOrders + refundedOrders)) * 100,
            )
          : 0,
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    users: users.map((u: any) => ({
      id: u.id,
      name: u.name,
      phone: u.phone,
      githubLogin: u.githubLogin,
      createdAt: u.createdAt.toISOString(),
      completedLevels: u.progress.length,
      paid: u.orders.some((o: any) => o.status === "paid" || o.status === "refunded"),
      graduated: graduatedUserIds.has(u.id),
      refunded: refundedUserIds.has(u.id),
    })),
  });
}
