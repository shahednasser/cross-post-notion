import { FrontmatterOptions } from './../clients/github-client';
import GitHubClient from "../clients/github-client"
// import Notion from "../clients/notion-client"


export type PostOptions = {
  frontmatter?: string | Record<string, any>
  addFrontmatter?: boolean
  frontmatterTitle?: string
  frontmatterDate?: string
}

export default async function post (url: string, options: PostOptions) {
  const frontmatter = typeof options.frontmatter === 'string' ? JSON.parse(options.frontmatter) : options.frontmatter

  const frontmatterOptions: FrontmatterOptions = {}

  if (options.frontmatterTitle) {
    frontmatterOptions.title = options.frontmatterTitle
  }

  if (options.frontmatterDate) {
    frontmatterOptions.date = options.frontmatterDate
  }
  
  const github = new GitHubClient(frontmatterOptions)
  await github.post(url, options.addFrontmatter, frontmatter)
}