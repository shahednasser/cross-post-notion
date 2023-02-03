import { NotionProperties } from "./notion"

export const MediumProperties = {
  ...NotionProperties,
  TAGS: 'tags',
  CANONICAL_URL: 'canonical_url',
} as const

export type MediumPropertiesType = typeof MediumProperties[keyof typeof MediumProperties]

export type MediumConnectionSettings = {
  token: string
  publication_name?: string
}

export type MediumOptions = {
  should_publish: boolean
  should_notify_followers: boolean
  properties?: Record<MediumPropertiesType, string>
}