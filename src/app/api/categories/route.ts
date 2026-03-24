import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { ensureSeedData } from "@/lib/seed";

export async function GET() {
  await ensureSeedData();
  const categories = await prisma.category.findMany({
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(categories);
}

export async function POST(request: Request) {
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
    },
  });

  return NextResponse.json(category, { status: 201 });
}
