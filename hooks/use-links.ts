"use client"

import { useState, useEffect, useCallback } from "react"
import type { TinyLink } from "@/lib/types"
import { getLinks as fetchLinks, createLink as apiCreateLink, deleteLink as apiDeleteLink, getLinkByShortCode as apiGetLinkByCode } from "@/lib/storage"

export function useLinks() {
  const [links, setLinks] = useState<TinyLink[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const refresh = useCallback(async () => {
    const res = await fetchLinks()
    setLinks(res)
  }, [])

  useEffect(() => {
    ;(async () => {
      await refresh()
      setIsLoading(false)
    })()
  }, [refresh])

  const addLink = useCallback(
    async (originalUrl: string, customCode?: string, expiresAt?: string | null) => {
      const newLink = await apiCreateLink(originalUrl, customCode, expiresAt)
      await refresh()
      return newLink
    },
    [refresh],
  )

  const editLink = useCallback(
    (id: string, updates: Partial<Pick<TinyLink, "originalUrl" | "shortCode" | "expiresAt">>) => {
      // No backend update endpoint available — no-op for now
      return null
    },
    [],
  )

  const removeLink = useCallback(
    async (code: string) => {
      const success = await apiDeleteLink(code)
      if (success) await refresh()
      return success
    },
    [refresh],
  )

  const trackClick = useCallback(
    async (shortCode: string, referrer?: string) => {
      // No dedicated click endpoint; fetch latest data
      const updated = await apiGetLinkByCode(shortCode)
      if (updated) await refresh()
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
