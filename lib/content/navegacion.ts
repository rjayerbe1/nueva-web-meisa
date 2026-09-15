import { cache } from "react"
import { prisma } from "@/lib/prisma"
import { getSitio } from "@/lib/content/snapshot"
import type { MenuItem, FooterLink, SocialLink } from "@prisma/client"

export type MenuItemPublic = MenuItem
export type FooterLinkPublic = FooterLink
export type SocialLinkPublic = SocialLink

export const getMenuItems = cache(async (): Promise<MenuItem[]> => {
  return (await getSitio()).menu
})

export const getFooterLinks = cache(async (): Promise<FooterLink[]> => {
  return (await getSitio()).footer
})

export const getSocialLinks = cache(async (): Promise<SocialLink[]> => {
  return (await getSitio()).social
})

export type NavegacionData = {
  menu: MenuItem[]
  footer: FooterLink[]
  social: SocialLink[]
}

export async function getNavegacionData(): Promise<NavegacionData> {
  const [menu, footer, social] = await Promise.all([
    getMenuItems(),
    getFooterLinks(),
    getSocialLinks(),
  ])
  return { menu, footer, social }
}

export async function getAllNavegacionData() {
  const [menu, footer, social] = await Promise.all([
    prisma.menuItem.findMany({ orderBy: { orden: "asc" } }),
    prisma.footerLink.findMany({
      orderBy: [{ grupo: "asc" }, { orden: "asc" }],
    }),
    prisma.socialLink.findMany({ orderBy: { orden: "asc" } }),
  ])
  return { menu, footer, social }
}
