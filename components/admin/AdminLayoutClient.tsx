"use client"

import { useState } from "react"
import { AdminSidebar } from "./AdminSidebar"
import { AdminHeader } from "./AdminHeader"

interface AdminLayoutClientProps {
  children: React.ReactNode
  restrictedToTalento?: boolean
}

export function AdminLayoutClient({ children, restrictedToTalento }: AdminLayoutClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-stone-50 font-lato">
      <AdminSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        restrictedToTalento={restrictedToTalento}
      />

      <div className="flex-1 flex flex-col overflow-hidden lg:ml-64">
        <AdminHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1600px] py-6 px-4 sm:px-6 lg:px-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
