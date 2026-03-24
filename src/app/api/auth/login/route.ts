import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

import { createSession, setSessionCookie } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    email?: string;
    password?: string;
  };

  const email = body.email?.trim().toLowerCase();
  const password = body.password?.trim();

  if (!email || !password) {
    return NextResponse.json({ error: "请输入邮箱和密码" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: "账号不存在" }, { status: 400 });
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return NextResponse.json({ error: "密码错误" }, { status: 400 });
  }

  const token = await createSession({ userId: user.id, email: user.email, name: user.name });
  await setSessionCookie(token);

  return NextResponse.json({ ok: true, user: { id: user.id, name: user.name, email: user.email } });
}
