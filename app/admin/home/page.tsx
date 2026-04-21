import { getAllHomeData } from "@/lib/content/home"
import { HomeAdminTabs } from "@/components/admin/home/HomeAdminTabs"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function HomeAdminPage() {
  const data = await getAllHomeData()
  return <HomeAdminTabs {...data} />
}
