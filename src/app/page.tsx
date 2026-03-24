import { BookkeepingDashboard } from "@/components/bookkeeping-dashboard";
import { getDashboardData } from "@/lib/dashboard";

export const dynamic = "force-dynamic";

export default async function Home() {
  const data = await getDashboardData();

  return <BookkeepingDashboard data={data} />;
}
