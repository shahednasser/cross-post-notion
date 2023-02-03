import { NotionProperties } from "./notion"

export const HashnodeProperties = {
  ...NotionProperties,
  ORIGINAL_ARTICLE_URL: 'original_article_url',
  SUBTITLE: 'subtitle',
  TAGS: 'tags'
} as const

export type HashnodePropertiesType = typeof HashnodeProperties[keyof typeof HashnodeProperties]

export type HashnodeConnectionSettings = {
  token: string
  publication_id?: string
}

export type HashnodeOptions = {
  should_hide: boolean
  properties?: Record<HashnodePropertiesType, string>
}