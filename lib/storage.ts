import type { TinyLink } from "./types"

const STORAGE_KEY = "tinylink_links"

export function getLinks(): TinyLink[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored ? JSON.parse(stored) : []
}

export function saveLinks(links: TinyLink[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(links))
}

export function generateShortCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let result = ""
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export function createLink(originalUrl: string, customCode?: string, expiresAt?: string | null): TinyLink {
  const links = getLinks()
  let shortCode = customCode || generateShortCode()

  // Ensure unique short code
  while (links.some((link) => link.shortCode === shortCode)) {
    shortCode = generateShortCode()
  }

  const newLink: TinyLink = {
    id: crypto.randomUUID(),
    originalUrl,
    shortCode,
    createdAt: new Date().toISOString(),
    expiresAt: expiresAt || null,
    clicks: 0,
    clickHistory: [],
  }

  saveLinks([newLink, ...links])
  return newLink
}

export function updateLink(
  id: string,
  updates: Partial<Pick<TinyLink, "originalUrl" | "shortCode" | "expiresAt">>,
): TinyLink | null {
  const links = getLinks()
  const index = links.findIndex((link) => link.id === id)

  if (index === -1) return null

  // Check for duplicate short code
  if (updates.shortCode) {
    const duplicate = links.find((link) => link.shortCode === updates.shortCode && link.id !== id)
    if (duplicate) return null
  }

  links[index] = { ...links[index], ...updates }
  saveLinks(links)
  return links[index]
}

export function deleteLink(id: string): boolean {
  const links = getLinks()
  const filtered = links.filter((link) => link.id !== id)
  if (filtered.length === links.length) return false
  saveLinks(filtered)
  return true
}

export function recordClick(shortCode: string, referrer?: string): TinyLink | null {
  const links = getLinks()
  const index = links.findIndex((link) => link.shortCode === shortCode)

  if (index === -1) return null

  const link = links[index]

  // Check if expired
  if (link.expiresAt && new Date(link.expiresAt) < new Date()) {
    return null
  }

  links[index] = {
    ...link,
    clicks: link.clicks + 1,
    clickHistory: [...link.clickHistory, { timestamp: new Date().toISOString(), referrer: referrer || null }],
  }

  saveLinks(links)
  return links[index]
}

export function getLinkByShortCode(shortCode: string): TinyLink | null {
  const links = getLinks()
  return links.find((link) => link.shortCode === shortCode) || null
}

export function isLinkExpired(link: TinyLink): boolean {
  if (!link.expiresAt) return false
  return new Date(link.expiresAt) < new Date()
}
