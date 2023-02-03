export const NotionProperties = {
  TITLE: 'title',
  DATE: 'date'
} as const

export type NotionPropertiesType = typeof NotionProperties[keyof typeof NotionProperties]

export type NotionOptions = {
  skip_block_types?: string[]
}

export type NotionConnectionSettings = {
  token: string
}