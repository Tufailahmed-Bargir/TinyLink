"use client"

import { useMemo } from "react"
import { BarChart3, Clock, MousePointerClick, TrendingUp, Calendar } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import type { TinyLink } from "@/lib/types"
import { ClicksChart } from "@/components/clicks-chart"

interface LinkStatsDialogProps {
  link: TinyLink | null
  open: boolean
  onClose: () => void
}

export function LinkStatsDialog({ link, open, onClose }: LinkStatsDialogProps) {
  const stats = useMemo(() => {
    if (!link) return null

    const clickHistory = link.clickHistory || []
    const totalClicks = link.clicks

    // Calculate clicks by day (last 7 days)
    const now = new Date()
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(now)
      date.setDate(date.getDate() - (6 - i))
      return date.toISOString().split("T")[0]
    })

    const clicksByDay = last7Days.map((day) => {
      const count = clickHistory.filter((click) => click.timestamp.split("T")[0] === day).length
      return {
        date: day,
        clicks: count,
        label: new Date(day).toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        }),
      }
    })

    // Calculate today's clicks
    const today = now.toISOString().split("T")[0]
    const todayClicks = clickHistory.filter((click) => click.timestamp.split("T")[0] === today).length

    // Calculate this week's clicks
    const weekAgo = new Date(now)
    weekAgo.setDate(weekAgo.getDate() - 7)
    const weekClicks = clickHistory.filter((click) => new Date(click.timestamp) >= weekAgo).length

    // Calculate average clicks per day
    const daysSinceCreation = Math.max(
      1,
      Math.ceil((now.getTime() - new Date(link.createdAt).getTime()) / (1000 * 60 * 60 * 24)),
    )
    const avgClicksPerDay = (totalClicks / daysSinceCreation).toFixed(1)

    return {
      totalClicks,
      todayClicks,
      weekClicks,
      avgClicksPerDay,
      clicksByDay,
    }
  }, [link])

  if (!link || !stats) return null

  const statCards = [
    {
      label: "Total Clicks",
      value: stats.totalClicks,
      icon: MousePointerClick,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Today",
      value: stats.todayClicks,
      icon: Calendar,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      label: "This Week",
      value: stats.weekClicks,
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      label: "Avg/Day",
      value: stats.avgClicksPerDay,
      icon: BarChart3,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ]

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Link Statistics
          </DialogTitle>
          <DialogDescription className="flex items-center gap-2">
            <code className="rounded bg-muted px-2 py-0.5 text-sm">{link.shortCode}</code>
            <span className="text-muted-foreground">→</span>
            <span className="truncate text-sm">{link.originalUrl}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {statCards.map((stat) => (
              <Card key={stat.label}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.bgColor}`}>
                      <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardContent className="p-4">
              <h4 className="mb-4 font-medium">Clicks Over Time (Last 7 Days)</h4>
              <ClicksChart data={stats.clicksByDay} />
            </CardContent>
          </Card>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>
              Created{" "}
              {new Date(link.createdAt).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
