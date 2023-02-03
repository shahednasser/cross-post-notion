import DevToClient from "../clients/devto-client";
import GitHubClient from "../clients/github-client"
import HashnodeClient from "../clients/hashnode-client";
import MediumClient from "../clients/medium-client";
import GlobalOptions from "../types/global-options";

type PostOptions = GlobalOptions

export default async function post (url: string, { config }: PostOptions) {
  const github = new GitHubClient(config.github, config.notion)

  const devto = new DevToClient(config.devto, config.notion)

  const hashnode = new HashnodeClient(config.hashnode, config.notion)

  const medium = new MediumClient(config.medium, config.notion)

  await Promise.all([
    github.post(url),
    devto.post(url),
    hashnode.post(url),
    medium.post(url)
  ])
  .then(() => console.log('Finished posting the article'))
}