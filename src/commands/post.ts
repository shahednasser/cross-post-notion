import DevToClient from "../clients/devto-client";
import GitHubClient from "../clients/github-client"
import GlobalOptions from "../types/global-options";

type PostOptions = GlobalOptions

export default async function post (url: string, { config }: PostOptions) {
  // const github = new GitHubClient(config.github, config.notion)
  // await github.post(url)
  const devto = new DevToClient(config.devto, config.notion)

  await devto.post(url)
}