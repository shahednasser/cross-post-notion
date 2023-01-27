import GitHubClient from "../clients/github-client"
import Config from "../types/config";

export default async function post (url: string, options: Config) {
  
  const github = new GitHubClient(options.github, options.notion)
  await github.post(url)
}