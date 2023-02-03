import { NotionProperties } from "./notion"

export const DevToProperties = {
  ...NotionProperties,
  TAGS: 'tags',
  SERIES: 'series',
  CANONICAL_URL: 'canonical_url',
  DESCRIPTION: 'description'
} as const

export type DevToPropertiesType = typeof DevToProperties[keyof typeof DevToProperties]

export type DevToConnectionSettings = {
  api_key: string
  organization_id?: string
}

export type DevToOptions = {
  should_publish: boolean
  properties?: Record<DevToPropertiesType, string>
}