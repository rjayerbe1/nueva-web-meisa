"use client"

import { useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

export interface AdminTab {
  id: string
  label: string
  content: React.ReactNode
  count?: number
  disabled?: boolean
}

interface AdminTabsLayoutProps {
  title: string
  description?: string
  eyebrow?: string
  tabs: AdminTab[]
  defaultTab?: string
  actions?: React.ReactNode
  paramName?: string
}

export function AdminTabsLayout({
  title,
  description,
  eyebrow,
  tabs,
  defaultTab,
  actions,
  paramName = "tab",
}: AdminTabsLayoutProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const fromUrl = searchParams.get(paramName)
  const fallback = defaultTab ?? tabs[0]?.id
  const activeTab = tabs.some((t) => t.id === fromUrl) ? (fromUrl as string) : fallback

  const handleChange = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(paramName, value)
      router.replace(`?${params.toString()}`, { scroll: false })
    },
    [router, searchParams, paramName],
  )

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="min-w-0">
          {eyebrow && (
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
              {eyebrow}
            </p>
          )}
          <h1 className="font-bebas text-4xl uppercase leading-[0.95] text-slate-950 md:text-5xl">
            {title}
          </h1>
          {description && (
            <p className="mt-2 max-w-2xl font-lato text-sm text-slate-600">
              {description}
            </p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>

      <Tabs value={activeTab} onValueChange={handleChange} className="w-full">
        {/* Tabs as underline navigation */}
        <TabsList className="h-auto w-full flex-wrap justify-start gap-0 rounded-none border-b border-slate-200 bg-transparent p-0">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              disabled={tab.disabled}
              className={cn(
                "group relative rounded-none border-b-2 border-transparent bg-transparent px-4 py-3 text-sm font-lato font-medium text-slate-500 shadow-none transition-colors",
                "hover:text-slate-900",
                "data-[state=active]:border-red-600 data-[state=active]:bg-transparent data-[state=active]:text-red-600 data-[state=active]:font-semibold data-[state=active]:shadow-none",
                "focus-visible:outline-none focus-visible:ring-0",
              )}
            >
              <span>{tab.label}</span>
              {typeof tab.count === "number" && (
                <span
                  className={cn(
                    "ml-2 rounded-full px-2 py-0.5 text-[11px] font-semibold transition-colors",
                    "bg-slate-100 text-slate-600",
                    "group-data-[state=active]:bg-red-50 group-data-[state=active]:text-red-700",
                  )}
                >
                  {tab.count}
                </span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className="mt-6 focus-visible:outline-none">
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
