import { redirect } from "next/navigation";

import { BookkeepingDashboard } from "@/components/bookkeeping-dashboard";
import { getSession } from "@/lib/auth";
import { getDashboardData } from "@/lib/dashboard";

export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await getSession();
  if (!session?.userId) {
    redirect("/login");
  }

  const data = await getDashboardData(session.userId);

  return <BookkeepingDashboard data={data} userName={session.name} />;
}
