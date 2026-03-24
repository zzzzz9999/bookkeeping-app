import Link from "next/link";
import { redirect } from "next/navigation";

import { AuthForm } from "@/components/auth-form";
import { getSession } from "@/lib/auth";

export default async function LoginPage() {
  const session = await getSession();
  if (session?.userId) {
    redirect("/");
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-6">
      <div className="w-full space-y-4">
        <AuthForm mode="login" />
        <p className="text-center text-sm text-zinc-500">
          还没有账号？ <Link className="text-black underline" href="/register">去注册</Link>
        </p>
      </div>
    </main>
  );
}
