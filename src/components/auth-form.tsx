"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ username: "", password: "" });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch(`/api/auth/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const body = await res.json().catch(() => ({}));
    setLoading(false);

    if (!res.ok) {
      setError(body.error || "操作失败");
      return;
    }

    router.push("/");
    router.refresh();
  };

  return (
    <form onSubmit={submit} className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold">{mode === "login" ? "登录" : "注册"}</h1>
      <p className="text-sm text-zinc-500">
        {mode === "login"
          ? "登录后查看你自己的账本。"
          : "创建一个账号开始记账，账号和密码都至少 6 位。"}
      </p>

      <input
        className="w-full rounded-md border px-3 py-2"
        placeholder="账号（至少 6 位）"
        value={form.username}
        onChange={(e) => setForm({ ...form, username: e.target.value })}
      />
      <input
        className="w-full rounded-md border px-3 py-2"
        placeholder="密码（至少 6 位）"
        type="password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      {error && <p className="text-sm text-rose-600">{error}</p>}

      <button className="w-full rounded-md bg-black px-4 py-2 text-white disabled:opacity-60" disabled={loading}>
        {loading ? "处理中..." : mode === "login" ? "登录" : "注册"}
      </button>
    </form>
  );
}
