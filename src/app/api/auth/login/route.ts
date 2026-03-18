import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createSession } from "@/lib/auth";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { phone, password } = await req.json();

    if (!phone || !password) {
      return NextResponse.json(
        { error: "手机号和密码不能为空" },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({ where: { phone } });
    if (!user || !user.passwordHash) {
      return NextResponse.json(
        { error: "手机号或密码错误" },
        { status: 401 },
      );
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json(
        { error: "手机号或密码错误" },
        { status: 401 },
      );
    }

    await createSession(user.id);

    return NextResponse.json({
      user: { id: user.id, name: user.name, phone: user.phone },
    });
  } catch {
    return NextResponse.json({ error: "登录失败" }, { status: 500 });
  }
}
