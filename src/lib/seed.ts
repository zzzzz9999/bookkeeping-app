import { prisma } from "@/lib/prisma";

const defaultCategories = [
  { name: "餐饮", color: "#f97316", icon: "🍜" },
  { name: "交通", color: "#3b82f6", icon: "🚕" },
  { name: "住房", color: "#8b5cf6", icon: "🏠" },
  { name: "购物", color: "#ec4899", icon: "🛍️" },
  { name: "娱乐", color: "#22c55e", icon: "🎮" },
  { name: "医疗", color: "#ef4444", icon: "💊" },
  { name: "工资", color: "#14b8a6", icon: "💼" },
  { name: "其他", color: "#6b7280", icon: "🧾" },
];

export async function ensureSeedData(userId: string) {
  const count = await prisma.category.count({ where: { userId } });
  if (count > 0) return;

  await prisma.category.createMany({
    data: defaultCategories.map((item) => ({ ...item, userId })),
  });
}
