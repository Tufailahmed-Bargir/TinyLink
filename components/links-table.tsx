"use client"

import { useState } from "react"
import { Copy, ExternalLink, MoreHorizontal, Pencil, Trash2, BarChart3, Clock, Check, Link2Off } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { TinyLink } from "@/lib/types"
import { isLinkExpired } from "@/lib/storage"
import { EditLinkDialog } from "@/components/edit-link-dialog"
import { DeleteLinkDialog } from "@/components/delete-link-dialog"
import { LinkStatsDialog } from "@/components/link-stats-dialog"

interface LinksTableProps {
  links: TinyLink[]
  isLoading: boolean
  onEdit: (id: string, updates: Partial<Pick<TinyLink, "originalUrl" | "shortCode" | "expiresAt">>) => TinyLink | null
  onDelete: (code: string) => void
}

export function LinksTable({ links, isLoading, onEdit, onDelete }: LinksTableProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [editingLink, setEditingLink] = useState<TinyLink | null>(null)
  const [deletingLink, setDeletingLink] = useState<TinyLink | null>(null)
  const [statsLink, setStatsLink] = useState<TinyLink | null>(null)

  const getShortUrl = (shortCode: string) => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/r/${shortCode}`
    }
    return `/r/${shortCode}`
  }

  const copyToClipboard = async (link: TinyLink) => {
    const shortUrl = getShortUrl(link.shortCode)
    await navigator.clipboard.writeText(shortUrl)
    setCopiedId(link.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const truncateUrl = (url: string, maxLength = 40) => {
    if (url.length <= maxLength) return url
    return url.substring(0, maxLength) + "..."
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex h-64 items-center justify-center">
          <div className="text-muted-foreground">Loading links...</div>
        </CardContent>
      </Card>
    )
  }

  if (links.length === 0) {
    return (
      <Card>
        <CardContent className="flex h-64 flex-col items-center justify-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Link2Off className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="text-center">
            <h3 className="font-semibold">No links yet</h3>
            <p className="text-sm text-muted-foreground">Create your first shortened link to get started</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>All Links</CardTitle>
          <CardDescription>
            {links.length} link{links.length !== 1 ? "s" : ""} total
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Short URL</TableHead>
                <TableHead className="hidden md:table-cell">Original URL</TableHead>
                <TableHead className="hidden sm:table-cell">Created</TableHead>
                <TableHead>Clicks</TableHead>
                <TableHead className="hidden lg:table-cell">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {links.map((link) => {
                const expired = isLinkExpired(link)
                return (
                  <TableRow key={link.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <code className="rounded bg-muted px-2 py-1 text-sm font-mono">{link.shortCode}</code>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => copyToClipboard(link)}>
                          {copiedId === link.id ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="hidden max-w-xs md:table-cell">
                      <a
                        href={link.originalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                      >
                        {truncateUrl(link.originalUrl)}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <span className="text-sm text-muted-foreground">{formatDate(link.createdAt)}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{link.clicks}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {expired ? (
                        <Badge variant="destructive" className="gap-1">
                          <Clock className="h-3 w-3" />
                          Expired
                        </Badge>
                      ) : link.expiresAt ? (
                        <Badge variant="secondary" className="gap-1">
                          <Clock className="h-3 w-3" />
                          Expires {formatDate(link.expiresAt)}
                        </Badge>
                      ) : (
                        <Badge variant="outline">Active</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => copyToClipboard(link)}>
                            <Copy className="mr-2 h-4 w-4" />
                            Copy Link
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setStatsLink(link)}>
                            <BarChart3 className="mr-2 h-4 w-4" />
                            View Stats
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => setEditingLink(link)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setDeletingLink(link)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <EditLinkDialog link={editingLink} open={!!editingLink} onClose={() => setEditingLink(null)} onSave={onEdit} />

      <DeleteLinkDialog
        link={deletingLink}
        open={!!deletingLink}
        onClose={() => setDeletingLink(null)}
        onConfirm={onDelete}
      />

      <LinkStatsDialog link={statsLink} open={!!statsLink} onClose={() => setStatsLink(null)} />
    </>
  )
}
