import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

import { createSession, setSessionCookie } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    username?: string;
    password?: string;
  };

  const username = body.username?.trim();
  const password = body.password?.trim();

  if (!username || !password) {
    return NextResponse.json({ error: "请输入账号和密码" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) {
    return NextResponse.json({ error: "账号不存在" }, { status: 400 });
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return NextResponse.json({ error: "密码错误" }, { status: 400 });
  }

  const token = await createSession({ userId: user.id, email: user.username, name: user.username });
  await setSessionCookie(token);

  return NextResponse.json({ ok: true, user: { id: user.id, username: user.username } });
}
