import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

import { createSession, setSessionCookie } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ensureSeedData } from "@/lib/seed";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    username?: string;
    password?: string;
  };

  const username = body.username?.trim();
  const password = body.password?.trim();

  if (!username || !password) {
    return NextResponse.json({ error: "请填写账号和密码" }, { status: 400 });
  }

  if (username.length < 6) {
    return NextResponse.json({ error: "账号至少 6 位" }, { status: 400 });
  }

  if (password.length < 6) {
    return NextResponse.json({ error: "密码至少 6 位" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) {
    return NextResponse.json({ error: "这个账号已存在" }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { username, passwordHash },
  });

  await ensureSeedData(user.id);
  const token = await createSession({ userId: user.id, email: user.username, name: user.username });
  await setSessionCookie(token);

  return NextResponse.json({ ok: true, user: { id: user.id, username: user.username } });
}
