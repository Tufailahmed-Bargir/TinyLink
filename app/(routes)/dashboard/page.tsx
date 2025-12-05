"use client"

import { useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react"
import Link from "next/link"
import { Link2, ArrowLeft, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ShortenForm } from "@/components/shorten-form"
import { LinksTable } from "@/components/links-table"
import { DashboardStats } from "@/components/dashboard-stats"
import { useLinks } from "@/hooks/use-links"
import type { TinyLink } from "@/lib/types"
import { LinkCreatedDialog } from "@/components/link-created-dialog"

function DashboardContent() {
  const searchParams = useSearchParams()
  const initialUrl = searchParams.get("url") || ""
  const { links, isLoading, addLink, editLink, removeLink } = useLinks()
  const [createdLink, setCreatedLink] = useState<TinyLink | null>(null)
  const [showForm, setShowForm] = useState(true)

  useEffect(() => {
    if (initialUrl) {
      setShowForm(true)
    }
  }, [initialUrl])

  const handleShorten = async (url: string, customCode?: string, expiresAt?: string | null) => {
    const newLink = await addLink(url, customCode, expiresAt)
    setCreatedLink(newLink as any)
    setShowForm(false)
  }

  const handleEdit = (id: string, updates: Partial<Pick<TinyLink, "originalUrl" | "shortCode" | "expiresAt">>) => {
    return editLink(id, updates)
  }

  const handleDelete = async (code: string) => {
    await removeLink(code)
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Link2 className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold tracking-tight">TinyLink</span>
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="font-medium">Dashboard</span>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Your Links</h1>
            <p className="text-muted-foreground">Create, manage, and track your shortened URLs</p>
          </div>
          {!showForm && (
            <Button onClick={() => setShowForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Link
            </Button>
          )}
        </div>

        {links.length > 0 && (
          <div className="mb-8">
            <DashboardStats links={links} />
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-3">
          <div className={showForm ? "lg:col-span-1" : "hidden"}>
            <ShortenForm onShorten={handleShorten} initialUrl={initialUrl} />
          </div>

          <div className={showForm ? "lg:col-span-2" : "lg:col-span-3"}>
            <LinksTable links={links} isLoading={isLoading} onEdit={handleEdit} onDelete={handleDelete} />
          </div>
        </div>
      </main>

      <LinkCreatedDialog link={createdLink} open={!!createdLink} onClose={() => setCreatedLink(null)} />
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <DashboardContent />
    </Suspense>
  )
}
