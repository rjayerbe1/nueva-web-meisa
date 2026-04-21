import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default function HeroImagesLegacyRedirect() {
  redirect("/admin/home?tab=hero")
}
