import { cache } from "react"
import { prisma } from "@/lib/prisma"
import { cachedContent } from "@/lib/cache/content-cache"
import { TAGS } from "@/lib/cache/tags"
import type { MenuItem, FooterLink, SocialLink } from "@prisma/client"

export type MenuItemPublic = MenuItem
export type FooterLinkPublic = FooterLink
export type SocialLinkPublic = SocialLink

export const getMenuItems = cache(
  cachedContent(["menu-items"], [TAGS.menuItems], async (): Promise<MenuItem[]> => {
    return prisma.menuItem.findMany({
      where: { activo: true },
      orderBy: { orden: "asc" },
    })
  }),
)

export const getFooterLinks = cache(
  cachedContent(["footer-links"], [TAGS.footerLinks], async (): Promise<FooterLink[]> => {
    return prisma.footerLink.findMany({
      where: { activo: true },
      orderBy: [{ grupo: "asc" }, { orden: "asc" }],
    })
  }),
)

export const getSocialLinks = cache(
  cachedContent(["social-links"], [TAGS.socialLinks], async (): Promise<SocialLink[]> => {
    return prisma.socialLink.findMany({
      where: { activo: true },
      orderBy: { orden: "asc" },
    })
  }),
)

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
