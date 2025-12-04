"use client"

import { useMemo } from "react"
import { Link2, MousePointerClick, TrendingUp, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import type { TinyLink } from "@/lib/types"
import { isLinkExpired } from "@/lib/storage"

interface DashboardStatsProps {
  links: TinyLink[]
}

export function DashboardStats({ links }: DashboardStatsProps) {
  const stats = useMemo(() => {
    const totalLinks = links.length
    const totalClicks = links.reduce((sum, link) => sum + link.clicks, 0)
    const activeLinks = links.filter((link) => !isLinkExpired(link)).length
    const expiredLinks = links.filter((link) => isLinkExpired(link)).length

    // Top performing link
    const topLink = links.reduce(
      (top, link) => (link.clicks > (top?.clicks || 0) ? link : top),
      null as TinyLink | null,
    )

    return {
      totalLinks,
      totalClicks,
      activeLinks,
      expiredLinks,
      topLink,
    }
  }, [links])

  const statCards = [
    {
      label: "Total Links",
      value: stats.totalLinks,
      icon: Link2,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Total Clicks",
      value: stats.totalClicks,
      icon: MousePointerClick,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      label: "Active Links",
      value: stats.activeLinks,
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      label: "Expired Links",
      value: stats.expiredLinks,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
