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
  tabs: AdminTab[]
  defaultTab?: string
  actions?: React.ReactNode
  paramName?: string
}

export function AdminTabsLayout({
  title,
  description,
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
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {description && (
            <p className="mt-1 text-sm text-gray-600">{description}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>

      <Tabs value={activeTab} onValueChange={handleChange} className="w-full">
        <TabsList className="h-auto w-full flex-wrap justify-start gap-1 rounded-lg bg-gray-100 p-1">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              disabled={tab.disabled}
              className="data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm"
            >
              <span>{tab.label}</span>
              {typeof tab.count === "number" && (
                <span
                  className={cn(
                    "ml-2 rounded-full px-2 py-0.5 text-xs font-medium",
                    "bg-gray-200 text-gray-700",
                    "group-data-[state=active]:bg-blue-100 group-data-[state=active]:text-blue-700",
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
