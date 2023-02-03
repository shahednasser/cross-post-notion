import { NotionProperties } from "./notion"

export const GitHubProperties = {
  ...NotionProperties,
  SLUG: 'slug'
} as const

export type GitHubPropertiesType = typeof GitHubProperties[keyof typeof GitHubProperties]

export enum DefaultFrontmatter {
  TITLE = 'title',
  DATE = 'date'
}

export type File = {
  path: string
  content: string
}

export type ImageDataUrl = {
  url: string
  ext: string
}

export type GitHubConnectionSettings = {
  token: string
  owner: string
  repo: string
  branch?: string
}

export type GitHubOptions = {
  image_path: ''
  image_prefix: '/'
  article_path: ''
  properties?: Record<GitHubPropertiesType, string>
  add_default_frontmatter?: boolean
  frontmatter_labels?: Record<DefaultFrontmatter, string>
  extra_frontmatter?: Record<string, string>
  extra_frontmatter_mapper?: Record<string, string>
}