"use client"

import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { TinyLink } from "@/lib/types"

interface EditLinkDialogProps {
  link: TinyLink | null
  open: boolean
  onClose: () => void
  onSave: (id: string, updates: Partial<Pick<TinyLink, "originalUrl" | "shortCode" | "expiresAt">>) => TinyLink | null
}

export function EditLinkDialog({ link, open, onClose, onSave }: EditLinkDialogProps) {
  const [originalUrl, setOriginalUrl] = useState("")
  const [shortCode, setShortCode] = useState("")
  const [expiresAt, setExpiresAt] = useState("")
  const [error, setError] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (link) {
      setOriginalUrl(link.originalUrl)
      setShortCode(link.shortCode)
      setExpiresAt(link.expiresAt ? link.expiresAt.slice(0, 16) : "")
      setError("")
    }
  }, [link])

  const handleSave = async () => {
    if (!link) return
    setError("")

    if (!originalUrl.trim()) {
      setError("URL is required")
      return
    }

    try {
      new URL(originalUrl)
    } catch {
      setError("Please enter a valid URL")
      return
    }

    if (!shortCode.trim()) {
      setError("Short code is required")
      return
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(shortCode)) {
      setError("Short code can only contain letters, numbers, hyphens, and underscores")
      return
    }

    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 300))

    const result = onSave(link.id, {
      originalUrl,
      shortCode,
      expiresAt: expiresAt || null,
    })

    setIsSaving(false)

    if (result) {
      onClose()
    } else {
      setError("Short code already exists. Please choose a different one.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Link</DialogTitle>
          <DialogDescription>Make changes to your shortened link</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-url">Destination URL</Label>
            <Input
              id="edit-url"
              value={originalUrl}
              onChange={(e) => {
                setOriginalUrl(e.target.value)
                setError("")
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-code">Short Code</Label>
            <Input
              id="edit-code"
              value={shortCode}
              onChange={(e) => {
                setShortCode(e.target.value)
                setError("")
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-expires">Expiration Date (optional)</Label>
            <Input
              id="edit-expires"
              type="datetime-local"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
