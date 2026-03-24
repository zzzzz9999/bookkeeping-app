import { NextResponse } from "next/server";

import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ensureSeedData } from "@/lib/seed";

export async function GET() {
  try {
    const user = await requireUser();
    await ensureSeedData(user.id);
    const categories = await prisma.category.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(categories);
  } catch {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const body = (await request.json()) as {
      name?: string;
      color?: string;
      icon?: string;
    };

    if (!body.name?.trim()) {
      return NextResponse.json({ error: "分类名称不能为空" }, { status: 400 });
    }

    const category = await prisma.category.create({
      data: {
        name: body.name.trim(),
        color: body.color || "#6b7280",
        icon: body.icon || "🧾",
        userId: user.id,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }
}
