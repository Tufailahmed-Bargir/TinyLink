"use client"

import { useState } from "react"
import { Check, Copy, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import type { TinyLink } from "@/lib/types"

interface LinkCreatedDialogProps {
  link: TinyLink | null
  open: boolean
  onClose: () => void
}

export function LinkCreatedDialog({ link, open, onClose }: LinkCreatedDialogProps) {
  const [copied, setCopied] = useState(false)

  if (!link) return null

  const shortUrl =
    typeof window !== "undefined" ? `${window.location.origin}/r/${link.shortCode}` : `/r/${link.shortCode}`

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(shortUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600">
              <Check className="h-5 w-5" />
            </div>
            Link Created!
          </DialogTitle>
          <DialogDescription>Your shortened link is ready to share</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Input readOnly value={shortUrl} className="font-mono" />
            <Button size="icon" onClick={copyToClipboard}>
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <div className="rounded-lg bg-muted p-4">
            <p className="mb-1 text-xs font-medium text-muted-foreground">REDIRECTS TO</p>
            <a
              href={link.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-primary hover:underline break-all"
            >
              {link.originalUrl}
              <ExternalLink className="h-3 w-3 flex-shrink-0" />
            </a>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button onClick={copyToClipboard}>{copied ? "Copied!" : "Copy Link"}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
