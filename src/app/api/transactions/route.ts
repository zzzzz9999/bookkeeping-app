import { NextResponse } from "next/server";

import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ensureSeedData } from "@/lib/seed";

export async function GET() {
  try {
    const user = await requireUser();
    await ensureSeedData(user.id);

    const transactions = await prisma.transaction.findMany({
      where: { userId: user.id },
      include: { category: true },
      orderBy: { occurredAt: "desc" },
    });

    return NextResponse.json(transactions);
  } catch {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const body = (await request.json()) as {
      title?: string;
      amount?: number | string;
      type?: "INCOME" | "EXPENSE";
      note?: string;
      occurredAt?: string;
      categoryId?: string;
    };

    const amount = Number(body.amount);

    if (!body.title?.trim()) {
      return NextResponse.json({ error: "标题不能为空" }, { status: 400 });
    }

    if (!body.categoryId) {
      return NextResponse.json({ error: "请选择分类" }, { status: 400 });
    }

    const category = await prisma.category.findFirst({
      where: { id: body.categoryId, userId: user.id },
    });
    if (!category) {
      return NextResponse.json({ error: "分类不存在" }, { status: 400 });
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json({ error: "金额必须大于 0" }, { status: 400 });
    }

    const transaction = await prisma.transaction.create({
      data: {
        title: body.title.trim(),
        amount,
        type: body.type === "INCOME" ? "INCOME" : "EXPENSE",
        note: body.note?.trim() || null,
        occurredAt: body.occurredAt ? new Date(body.occurredAt) : new Date(),
        categoryId: body.categoryId,
        userId: user.id,
      },
      include: { category: true },
    });

    return NextResponse.json(transaction, { status: 201 });
  } catch {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }
}
