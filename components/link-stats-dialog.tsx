"use client"

import { useMemo, useEffect, useState } from "react"
import { BarChart3, Clock, MousePointerClick, TrendingUp, Calendar, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import type { TinyLink } from "@/lib/types"
import { ClicksChart } from "@/components/clicks-chart"
import { getLinkByShortCode } from "@/lib/storage"

interface LinkStatsDialogProps {
  link: TinyLink | null
  open: boolean
  onClose: () => void
}

export function LinkStatsDialog({ link, open, onClose }: LinkStatsDialogProps) {
  const [freshLink, setFreshLink] = useState<TinyLink | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Fetch fresh data when dialog opens
  useEffect(() => {
    if (open && link) {
      setIsLoading(true)
      getLinkByShortCode(link.shortCode)
        .then((data) => {
          if (data) {
            setFreshLink(data)
          } else {
            setFreshLink(link) // Fallback to passed link if fetch fails
          }
        })
        .catch(() => {
          setFreshLink(link) // Fallback to passed link on error
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else if (!open) {
      setFreshLink(null)
    }
  }, [open, link])

  const displayLink = freshLink || link

  const stats = useMemo(() => {
    if (!displayLink) return null

    const totalClicks = displayLink.clicks || 0
    const now = new Date()
    const lastClicked = displayLink.lastClicked ? new Date(displayLink.lastClicked) : null

    // Calculate clicks by day (last 7 days)
    // Since we don't have click history, we'll show a simple distribution
    // or show that data is not available
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(now)
      date.setDate(date.getDate() - (6 - i))
      return date.toISOString().split("T")[0]
    })

    const clicksByDay = last7Days.map((day) => {
      // Check if lastClicked falls on this day
      const isLastClickedDay = lastClicked && lastClicked.toISOString().split("T")[0] === day
      // If it's the last clicked day and we have clicks, show 1 as a visual indicator
      // Otherwise show 0
      return {
        date: day,
        clicks: isLastClickedDay && totalClicks > 0 ? 1 : 0,
        label: new Date(day).toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        }),
      }
    })

    // Check if last click was today
    const today = now.toISOString().split("T")[0]
    const lastClickedToday = lastClicked && lastClicked.toISOString().split("T")[0] === today
    // We can't know exact today's clicks without history, so show "N/A" or estimate
    const todayClicks = lastClickedToday && totalClicks > 0 ? "1+" : "0"

    // Check if last click was this week
    const weekAgo = new Date(now)
    weekAgo.setDate(weekAgo.getDate() - 7)
    const lastClickedThisWeek = lastClicked && lastClicked >= weekAgo
    const weekClicks = lastClickedThisWeek && totalClicks > 0 ? "1+" : "0"

    // Calculate average clicks per day
    const daysSinceCreation = Math.max(
      1,
      Math.ceil((now.getTime() - new Date(displayLink.createdAt).getTime()) / (1000 * 60 * 60 * 24)),
    )
    const avgClicksPerDay = (totalClicks / daysSinceCreation).toFixed(1)

    return {
      totalClicks,
      todayClicks,
      weekClicks,
      avgClicksPerDay,
      clicksByDay,
      lastClicked,
    }
  }, [displayLink])

  if (!displayLink || !stats) return null

  const statCards = [
    {
      label: "Total Clicks",
      value: stats.totalClicks,
      icon: MousePointerClick,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Last Click",
      value: stats.lastClicked
        ? new Date(stats.lastClicked).toLocaleDateString("en-US", { month: "short", day: "numeric" })
        : "Never",
      icon: Calendar,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      label: "Avg/Day",
      value: stats.avgClicksPerDay,
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      label: "Days Active",
      value: Math.max(
        1,
        Math.ceil(
          (new Date().getTime() - new Date(displayLink.createdAt).getTime()) / (1000 * 60 * 60 * 24),
        ),
      ),
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
          <DialogDescription className="flex items-center gap-2 flex-wrap">
            <code className="rounded bg-muted px-2 py-0.5 text-sm font-mono">{displayLink.shortCode}</code>
            <span className="text-muted-foreground">→</span>
            <span className="truncate text-sm max-w-xs">{displayLink.originalUrl}</span>
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {statCards.map((stat) => (
                <Card key={stat.label}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.bgColor}`}>
                        <stat.icon className={`h-5 w-5 ${stat.color}`} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xl font-bold truncate">{stat.value}</p>
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
                {stats.totalClicks > 0 ? (
                  <ClicksChart data={stats.clicksByDay} />
                ) : (
                  <div className="flex h-48 items-center justify-center text-muted-foreground">
                    No click data yet. Share your link to start tracking!
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>
                  Created{" "}
                  {new Date(displayLink.createdAt).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              {stats.lastClicked && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MousePointerClick className="h-4 w-4" />
                  <span>
                    Last clicked{" "}
                    {new Date(stats.lastClicked).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
