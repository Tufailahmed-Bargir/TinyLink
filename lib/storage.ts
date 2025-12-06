import type { TinyLink } from "./types"

function mapServerLinkToTiny(link: any): TinyLink {
  return {
    id: String(link.id),
    originalUrl: link.targetUrl,
    shortCode: link.code,
    createdAt: link.createdAt,
    expiresAt: null,
    clicks: link.totalClicks ?? 0,
    clickHistory: [],
    lastClicked: link.lastClicked ? new Date(link.lastClicked).toISOString() : null,
  }
}

export async function getLinks(): Promise<TinyLink[]> {
  if (typeof window === "undefined") return []
  const res = await fetch('/api/links')
  if (!res.ok) return []
  const data = await res.json()
  const links = data.links || []
  return links.map(mapServerLinkToTiny)
}

export async function createLink(originalUrl: string, customCode?: string, expiresAt?: string | null): Promise<TinyLink | null> {
  const body: any = { targetUrl: originalUrl }
  if (customCode) body.customCode = customCode
  if (expiresAt) body.expiresAt = expiresAt

  const res = await fetch('/api/links', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) return null
  const data = await res.json()
  const link = data.link
  return mapServerLinkToTiny(link)
}

export async function deleteLink(code: string): Promise<boolean> {
  const res = await fetch(`/api/links/${encodeURIComponent(code)}`, { method: 'DELETE' })
  return res.ok
}

export async function getLinkByShortCode(code: string): Promise<TinyLink | null> {
  if (typeof window === 'undefined') return null
  const res = await fetch(`/api/links/${encodeURIComponent(code)}`)
  if (!res.ok) return null
  const data = await res.json()
  const link = data.data || data.link
  if (!link) return null
  return mapServerLinkToTiny(link)
}

export async function recordClick(shortCode: string, referrer?: string): Promise<TinyLink | null> {
  // No server endpoint to increment clicks; fetch latest data for the code
  return getLinkByShortCode(shortCode)
}

export function isLinkExpired(link: TinyLink): boolean {
  if (!link.expiresAt) return false
  return new Date(link.expiresAt) < new Date()
}
