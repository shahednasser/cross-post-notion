// import Notion from "../clients/notion-client"

import GitHubClient from "../clients/github-client"

export type PostOptions = Record<string, any>

export default async function post (url: string, options: PostOptions) {
  const github = new GitHubClient()
  await github.post(url)
}