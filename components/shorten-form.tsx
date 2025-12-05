"use client"

import type React from "react"

import { useState } from "react"
import { Link2, Sparkles, Calendar, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { isValidUrl } from "@/lib/validate"

interface ShortenFormProps {
  onShorten: (url: string, customCode?: string, expiresAt?: string | null) => void
  initialUrl?: string
}

export function ShortenForm({ 
  
  
  onShorten, initialUrl = "" }: ShortenFormProps) {
  const [url, setUrl] = useState(initialUrl)
  const [customCode, setCustomCode] = useState("")
  const [expiresAt, setExpiresAt] = useState("")
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!url.trim()) {
      setError("Please enter a URL")
      return
    }

    if (!isValidUrl(url)) {
      setError("Please enter a valid URL (include http:// or https://)")
      return
    }

    if (customCode && !/^[a-zA-Z0-9_-]+$/.test(customCode)) {
      setError("Custom code can only contain letters, numbers, hyphens, and underscores")
      return
    }

    setIsSubmitting(true)

    // Small delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 300))

    onShorten(url, customCode || undefined, expiresAt || null)
    setUrl("")
    setCustomCode("")
    setExpiresAt("")
    setIsSubmitting(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link2 className="h-5 w-5 text-primary" />
          Shorten a URL
        </CardTitle>
        <CardDescription>Enter a long URL to create a short, shareable link</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">Destination URL</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://example.com/very-long-url-here"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value)
                setError("")
              }}
              className="h-12"
            />
          </div>

          <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" type="button" className="gap-2">
                <Sparkles className="h-4 w-4" />
                {showAdvanced ? "Hide" : "Show"} advanced options
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="customCode">Custom Short Code (optional)</Label>
                <Input
                  id="customCode"
                  placeholder="my-custom-link"
                  value={customCode}
                  onChange={(e) => setCustomCode(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Leave empty for an auto-generated code</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiresAt" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Expiration Date (optional)
                </Label>
                <Input
                  id="expiresAt"
                  type="datetime-local"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Link will stop working after this date</p>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" className="w-full h-12" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Shortening...
              </>
            ) : (
              "Shorten URL"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
