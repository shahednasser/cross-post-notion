import { NotionConnectionSettings } from './clients/notion';
import { GitHubConnectionSettings, GitHubOptions } from "./clients/github"

export type ConfigGitHub = {
  options: GitHubOptions,
  connection_settings: GitHubConnectionSettings
}

export type ConfigNotion = {
  connection_settings: NotionConnectionSettings
}

type Config = {
  github: ConfigGitHub,
  notion: ConfigNotion
}

export default Config