"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Link2, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getLinkByShortCode, recordClick, isLinkExpired } from "@/lib/storage"

export default function RedirectPage() {
  const params = useParams()
  const code = params.code as string
  const [error, setError] = useState<"not-found" | "expired" | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const link = getLinkByShortCode(code)

    if (!link) {
      setError("not-found")
      setIsLoading(false)
      return
    }

    if (isLinkExpired(link)) {
      setError("expired")
      setIsLoading(false)
      return
    }

    // Record the click
    recordClick(code, document.referrer || undefined)

    // Redirect to the original URL
    window.location.href = link.originalUrl
  }, [code])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Redirecting...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center gap-6 pt-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold">{error === "not-found" ? "Link Not Found" : "Link Expired"}</h1>
              <p className="mt-2 text-muted-foreground">
                {error === "not-found"
                  ? "The link you're looking for doesn't exist or has been removed."
                  : "This link has expired and is no longer available."}
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" asChild>
                <Link href="/">
                  <Link2 className="mr-2 h-4 w-4" />
                  Go Home
                </Link>
              </Button>
              <Button asChild>
                <Link href="/dashboard">Create New Link</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return null
}
