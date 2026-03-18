import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const { payMethod } = await req.json();

  if (!["wechat", "alipay"].includes(payMethod)) {
    return NextResponse.json({ error: "不支持的支付方式" }, { status: 400 });
  }

  const existingPaid = await prisma.order.findFirst({
    where: { userId: user.id, status: "paid" },
  });
  if (existingPaid) {
    return NextResponse.json({ error: "已付费，无需重复购买" }, { status: 409 });
  }

  const order = await prisma.order.create({
    data: {
      userId: user.id,
      amount: 990, // 9.90 CNY in cents
      payMethod,
      status: "pending",
    },
  });

  // TODO: integrate real payment gateway
  // For WeChat Pay: call unified order API, return prepay_id
  // For Alipay: call trade.precreate, return qr_code

  return NextResponse.json({
    orderId: order.id,
    amount: order.amount,
    payMethod,
    // payUrl / qrCode / prepayId would go here
    _mock: true,
    message: "支付网关待接入，请配置商户号后启用",
  });
}
