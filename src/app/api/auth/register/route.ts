import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

import { createSession, setSessionCookie } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ensureSeedData } from "@/lib/seed";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    name?: string;
    email?: string;
    password?: string;
  };

  const name = body.name?.trim();
  const email = body.email?.trim().toLowerCase();
  const password = body.password?.trim();

  if (!name || !email || !password) {
    return NextResponse.json({ error: "请完整填写姓名、邮箱和密码" }, { status: 400 });
  }

  if (password.length < 6) {
    return NextResponse.json({ error: "密码至少 6 位" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "这个邮箱已注册" }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, passwordHash },
  });

  await ensureSeedData(user.id);
  const token = await createSession({ userId: user.id, email: user.email, name: user.name });
  await setSessionCookie(token);

  return NextResponse.json({ ok: true, user: { id: user.id, name: user.name, email: user.email } });
}
