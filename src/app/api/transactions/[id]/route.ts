import { NextResponse } from "next/server";

import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireUser();
    const { id } = await context.params;

    await prisma.transaction.deleteMany({
      where: { id, userId: user.id },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "未登录或无权限" }, { status: 401 });
  }
}
