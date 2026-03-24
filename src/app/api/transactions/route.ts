import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { ensureSeedData } from "@/lib/seed";

export async function GET() {
  await ensureSeedData();

  const transactions = await prisma.transaction.findMany({
    include: { category: true },
    orderBy: { occurredAt: "desc" },
  });

  return NextResponse.json(transactions);
}

export async function POST(request: Request) {
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
    },
    include: { category: true },
  });

  return NextResponse.json(transaction, { status: 201 });
}
