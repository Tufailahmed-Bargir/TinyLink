export interface TinyLink {
  id: string
  originalUrl: string
  shortCode: string
  createdAt: string
  expiresAt: string | null
  clicks: number
  clickHistory: ClickEvent[]
  lastClicked?: string | null
}

export interface ClickEvent {
  timestamp: string
  referrer: string | null
}
