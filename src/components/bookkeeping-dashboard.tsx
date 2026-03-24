"use client";

import { useMemo, useState, useTransition } from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";

type Category = {
  id: string;
  name: string;
  color: string;
  icon: string | null;
};

type Transaction = {
  id: string;
  title: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  note: string | null;
  occurredAt: string;
  categoryId: string;
  category: Category;
};

type DashboardData = {
  summary: {
    income: number;
    expenses: number;
    balance: number;
    transactionCount: number;
  };
  categories: Category[];
  transactions: Transaction[];
  monthlyByCategory: { categoryId: string; name: string; color: string; total: number }[];
  trendMonths: { month: string; income: number; expense: number }[];
};

export function BookkeepingDashboard({ data }: { data: DashboardData }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({
    title: "",
    amount: "",
    type: "EXPENSE",
    note: "",
    occurredAt: format(new Date(), "yyyy-MM-dd"),
    categoryId: data.categories[0]?.id ?? "",
  });
  const [error, setError] = useState<string | null>(null);

  const recent = useMemo(() => data.transactions.slice(0, 10), [data.transactions]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const res = await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        amount: Number(form.amount),
      }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({ error: "提交失败" }));
      setError(body.error || "提交失败");
      return;
    }

    setForm((prev) => ({ ...prev, title: "", amount: "", note: "" }));
    startTransition(() => router.refresh());
  };

  const removeTx = async (id: string) => {
    const res = await fetch(`/api/transactions/${id}`, { method: "DELETE" });
    if (!res.ok) return;
    startTransition(() => router.refresh());
  };

  return (
    <main className="mx-auto w-full max-w-6xl p-6 md:p-10 space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">记账系统</h1>
        <p className="text-sm text-zinc-500">Vibe Coding MVP · Next.js + Prisma + SQLite</p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat title="本月收入" value={`¥ ${data.summary.income.toFixed(2)}`} tone="text-emerald-600" />
        <Stat title="本月支出" value={`¥ ${data.summary.expenses.toFixed(2)}`} tone="text-rose-600" />
        <Stat title="本月结余" value={`¥ ${data.summary.balance.toFixed(2)}`} tone="text-blue-600" />
        <Stat title="本月笔数" value={`${data.summary.transactionCount}`} tone="text-zinc-700" />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">新增流水</h2>
          <form className="space-y-3" onSubmit={submit}>
            <div className="grid gap-3 sm:grid-cols-2">
              <input className="rounded-md border px-3 py-2" placeholder="标题（如：午餐）" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <input className="rounded-md border px-3 py-2" placeholder="金额" type="number" min="0" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <select className="rounded-md border px-3 py-2" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as "INCOME" | "EXPENSE" })}>
                <option value="EXPENSE">支出</option>
                <option value="INCOME">收入</option>
              </select>
              <select className="rounded-md border px-3 py-2" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
                {data.categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.icon || "🧾"} {category.name}
                  </option>
                ))}
              </select>
              <input className="rounded-md border px-3 py-2" type="date" value={form.occurredAt} onChange={(e) => setForm({ ...form, occurredAt: e.target.value })} />
            </div>

            <textarea className="min-h-20 w-full rounded-md border px-3 py-2" placeholder="备注（可选）" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />

            {error && <p className="text-sm text-rose-600">{error}</p>}

            <button disabled={isPending} className="rounded-md bg-black px-4 py-2 text-white disabled:opacity-60" type="submit">
              {isPending ? "提交中..." : "保存流水"}
            </button>
          </form>
        </article>

        <article className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">支出分类（本月）</h2>
          {data.monthlyByCategory.length === 0 ? (
            <p className="text-sm text-zinc-500">暂无支出数据</p>
          ) : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data.monthlyByCategory} dataKey="total" nameKey="name" outerRadius={90} label>
                    {data.monthlyByCategory.map((entry) => (
                      <Cell key={entry.categoryId} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `¥ ${Number(value ?? 0).toFixed(2)}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </article>
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">近 6 个月收支趋势</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.trendMonths}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `¥ ${Number(value ?? 0).toFixed(2)}`} />
              <Legend />
              <Bar dataKey="income" fill="#22c55e" name="收入" />
              <Bar dataKey="expense" fill="#ef4444" name="支出" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">最近 10 笔流水</h2>
        {recent.length === 0 ? (
          <p className="text-sm text-zinc-500">暂无流水，先新增一笔吧。</p>
        ) : (
          <div className="overflow-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b text-left text-zinc-500">
                  <th className="p-2">日期</th>
                  <th className="p-2">标题</th>
                  <th className="p-2">分类</th>
                  <th className="p-2">类型</th>
                  <th className="p-2">金额</th>
                  <th className="p-2">操作</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((tx) => (
                  <tr key={tx.id} className="border-b last:border-0">
                    <td className="p-2">{format(new Date(tx.occurredAt), "yyyy-MM-dd")}</td>
                    <td className="p-2">{tx.title}</td>
                    <td className="p-2">{tx.category.icon || "🧾"} {tx.category.name}</td>
                    <td className="p-2">{tx.type === "INCOME" ? "收入" : "支出"}</td>
                    <td className={`p-2 font-medium ${tx.type === "INCOME" ? "text-emerald-600" : "text-rose-600"}`}>
                      {tx.type === "INCOME" ? "+" : "-"}¥ {tx.amount.toFixed(2)}
                    </td>
                    <td className="p-2">
                      <button className="text-xs text-zinc-500 hover:text-rose-600" onClick={() => removeTx(tx.id)}>
                        删除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

function Stat({ title, value, tone }: { title: string; value: string; tone: string }) {
  return (
    <article className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <p className="text-sm text-zinc-500">{title}</p>
      <p className={`mt-1 text-2xl font-semibold ${tone}`}>{value}</p>
    </article>
  );
}
