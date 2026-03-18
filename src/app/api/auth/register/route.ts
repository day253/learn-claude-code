import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createSession } from "@/lib/auth";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { phone, password, name } = await req.json();

    if (!phone || !password) {
      return NextResponse.json(
        { error: "手机号和密码不能为空" },
        { status: 400 },
      );
    }

    if (!/^1\d{10}$/.test(phone)) {
      return NextResponse.json(
        { error: "请输入正确的手机号" },
        { status: 400 },
      );
    }

    const existing = await prisma.user.findUnique({ where: { phone } });
    if (existing) {
      return NextResponse.json(
        { error: "该手机号已注册" },
        { status: 409 },
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        phone,
        passwordHash,
        name: name || `学员${phone.slice(-4)}`,
      },
    });

    await createSession(user.id);

    return NextResponse.json({
      user: { id: user.id, name: user.name, phone: user.phone },
    });
  } catch {
    return NextResponse.json({ error: "注册失败" }, { status: 500 });
  }
}
