import GitHubClient from "../clients/github-client"
import GlobalOptions from "../types/global-options";

type PostOptions = GlobalOptions

export default async function post (url: string, { config }: PostOptions) {
  // console.log(config.github)
  const github = new GitHubClient(config.github, config.notion)
  await github.post(url)
}