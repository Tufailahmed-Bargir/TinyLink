"use client"

import { useState } from "react"
import { Loader2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { TinyLink } from "@/lib/types"

interface DeleteLinkDialogProps {
  link: TinyLink | null
  open: boolean
  onClose: () => void
  onConfirm: (code: string) => void
}

export function DeleteLinkDialog({ link, open, onClose, onConfirm }: DeleteLinkDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!link) return
    setIsDeleting(true)
    await new Promise((resolve) => setTimeout(resolve, 300))
    onConfirm(link.shortCode)
    setIsDeleting(false)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Delete Link
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this link? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        {link && (
          <div className="rounded-lg bg-muted p-4">
            <p className="font-mono text-sm">{link.shortCode}</p>
            <p className="mt-1 text-xs text-muted-foreground break-all">{link.originalUrl}</p>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Link"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
