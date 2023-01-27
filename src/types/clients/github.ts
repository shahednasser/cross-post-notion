export enum NotionProperties {
  TITLE = 'title',
  DATE = 'date',
  SLUG = 'slug'
}

export enum DefaultFrontmatter {
  TITLE = 'title',
  DATE = 'date'
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
  properties?: Record<NotionProperties, string>
  add_default_frontmatter?: boolean
  frontmatter_labels?: Record<DefaultFrontmatter, string>
  extra_frontmatter?: Record<string, string>
  extra_frontmatter_mapper?: Record<string, string>
}

export type File = {
  path: string
  content: string
}

export type ImageDataUrl = {
  url: string
  ext: string
}