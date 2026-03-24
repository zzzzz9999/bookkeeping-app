import { startOfMonth, subMonths } from "date-fns";

import { prisma } from "@/lib/prisma";
import { ensureSeedData } from "@/lib/seed";

export async function getDashboardData() {
  await ensureSeedData();

  const [categories, transactions] = await Promise.all([
    prisma.category.findMany({
      orderBy: { createdAt: "asc" },
    }),
    prisma.transaction.findMany({
      include: { category: true },
      orderBy: { occurredAt: "desc" },
      take: 20,
    }),
  ]);

  const monthStart = startOfMonth(new Date());
  const monthlyTransactions = transactions.filter(
    (item) => new Date(item.occurredAt) >= monthStart,
  );

  const income = monthlyTransactions
    .filter((item) => item.type === "INCOME")
    .reduce((sum, item) => sum + item.amount, 0);

  const expenses = monthlyTransactions
    .filter((item) => item.type === "EXPENSE")
    .reduce((sum, item) => sum + item.amount, 0);

  const monthlyByCategory = categories
    .map((category) => {
      const total = monthlyTransactions
        .filter(
          (item) => item.type === "EXPENSE" && item.categoryId === category.id,
        )
        .reduce((sum, item) => sum + item.amount, 0);

      return {
        categoryId: category.id,
        name: category.name,
        color: category.color,
        total: Number(total.toFixed(2)),
      };
    })
    .filter((item) => item.total > 0)
    .sort((a, b) => b.total - a.total);

  const trendMonths = Array.from({ length: 6 }).map((_, index) => {
    const target = startOfMonth(subMonths(new Date(), 5 - index));
    const nextMonth = startOfMonth(subMonths(new Date(), 4 - index));

    const monthItems = transactions.filter((item) => {
      const occurred = new Date(item.occurredAt);
      return occurred >= target && occurred < nextMonth;
    });

    return {
      month: `${target.getFullYear()}-${String(target.getMonth() + 1).padStart(2, "0")}`,
      income: Number(
        monthItems
          .filter((item) => item.type === "INCOME")
          .reduce((sum, item) => sum + item.amount, 0)
          .toFixed(2),
      ),
      expense: Number(
        monthItems
          .filter((item) => item.type === "EXPENSE")
          .reduce((sum, item) => sum + item.amount, 0)
          .toFixed(2),
      ),
    };
  });

  return {
    summary: {
      income: Number(income.toFixed(2)),
      expenses: Number(expenses.toFixed(2)),
      balance: Number((income - expenses).toFixed(2)),
      transactionCount: monthlyTransactions.length,
    },
    categories,
    transactions: transactions.map((item) => ({
      ...item,
      occurredAt: item.occurredAt.toISOString(),
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    })),
    monthlyByCategory,
    trendMonths,
  };
}
