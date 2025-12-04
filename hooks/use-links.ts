"use client"

import { useState, useEffect, useCallback } from "react"
import type { TinyLink } from "@/lib/types"
import { getLinks, createLink, updateLink, deleteLink, recordClick } from "@/lib/storage"

export function useLinks() {
  const [links, setLinks] = useState<TinyLink[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const refresh = useCallback(() => {
    setLinks(getLinks())
  }, [])

  useEffect(() => {
    refresh()
    setIsLoading(false)
  }, [refresh])

  const addLink = useCallback(
    (originalUrl: string, customCode?: string, expiresAt?: string | null) => {
      const newLink = createLink(originalUrl, customCode, expiresAt)
      refresh()
      return newLink
    },
    [refresh],
  )

  const editLink = useCallback(
    (id: string, updates: Partial<Pick<TinyLink, "originalUrl" | "shortCode" | "expiresAt">>) => {
      const updated = updateLink(id, updates)
      if (updated) refresh()
      return updated
    },
    [refresh],
  )

  const removeLink = useCallback(
    (id: string) => {
      const success = deleteLink(id)
      if (success) refresh()
      return success
    },
    [refresh],
  )

  const trackClick = useCallback(
    (shortCode: string, referrer?: string) => {
      const updated = recordClick(shortCode, referrer)
      if (updated) refresh()
      return updated
    },
    [refresh],
  )

  return {
    links,
    isLoading,
    addLink,
    editLink,
    removeLink,
    trackClick,
    refresh,
  }
}
