import Link from "next/link";
import { redirect } from "next/navigation";

import { AuthForm } from "@/components/auth-form";
import { getSession } from "@/lib/auth";

export default async function RegisterPage() {
  const session = await getSession();
  if (session?.userId) {
    redirect("/");
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-6">
      <div className="w-full space-y-4">
        <AuthForm mode="register" />
        <p className="text-center text-sm text-zinc-500">
          已有账号？ <Link className="text-black underline" href="/login">去登录</Link>
        </p>
      </div>
    </main>
  );
}
