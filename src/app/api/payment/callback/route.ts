import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

// WeChat Pay / Alipay callback endpoint
// In production: verify signature, update order, return success
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, tradeNo } = body;

    // TODO: verify payment gateway signature
    // For WeChat: verify XML signature with API key
    // For Alipay: verify RSA signature

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order || order.status !== "pending") {
      return NextResponse.json({ error: "订单不存在或已处理" }, { status: 400 });
    }

    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "paid",
        payTradeNo: tradeNo,
        paidAt: new Date(),
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "回调处理失败" }, { status: 500 });
  }
}
