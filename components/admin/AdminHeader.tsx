"use client"

import { useSession, signOut } from "next-auth/react"
import { Menu, X, User, LogOut, Settings, ExternalLink } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AdminBreadcrumb } from "./AdminBreadcrumb"

interface AdminHeaderProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export function AdminHeader({ sidebarOpen, setSidebarOpen }: AdminHeaderProps) {
  const { data: session } = useSession()
  const initials = (session?.user?.name?.charAt(0) ?? "A").toUpperCase()

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
      <div className="flex h-14 items-center gap-3 px-4 sm:px-6 lg:px-8">
        {/* Mobile menu button */}
        <button
          type="button"
          className="inline-flex items-center justify-center rounded p-2 text-slate-500 hover:bg-stone-100 hover:text-slate-900 lg:hidden"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Abrir menú"
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        {/* Logo mobile */}
        <Link href="/admin" className="flex items-center lg:hidden" aria-label="Dashboard">
          <Image
            src="/images/logo/logo-meisa.png"
            alt="MEISA"
            width={70}
            height={20}
            className="object-contain"
          />
        </Link>

        {/* Breadcrumb — desktop */}
        <div className="hidden flex-1 items-center lg:flex">
          <AdminBreadcrumb />
        </div>

        {/* Spacer mobile */}
        <div className="flex-1 lg:hidden" />

        {/* Quick actions */}
        <Link
          href="/"
          target="_blank"
          rel="noopener"
          className="hidden items-center gap-1.5 rounded border border-slate-200 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-600 transition-colors hover:border-red-600 hover:bg-red-50 hover:text-red-600 md:inline-flex"
        >
          Ver sitio
          <ExternalLink className="h-3 w-3" />
        </Link>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
              <Avatar className="h-9 w-9 border border-slate-200">
                <AvatarImage
                  src={session?.user?.image || ""}
                  alt={session?.user?.name || ""}
                />
                <AvatarFallback className="bg-slate-900 text-xs font-semibold text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{session?.user?.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {session?.user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Configuración</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-red-600"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Cerrar sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
