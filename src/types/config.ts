import { NotionConnectionSettings, NotionOptions } from './clients/notion';
import { GitHubConnectionSettings, GitHubOptions } from "./clients/github"
import { DevToConnectionSettings, DevToOptions } from './clients/devto';

export type ConfigGitHub = {
  options: GitHubOptions,
  connection_settings: GitHubConnectionSettings
}

export type ConfigNotion = {
  options: NotionOptions,
  connection_settings: NotionConnectionSettings
}

export type ConfigDevTo = {
  connection_settings: DevToConnectionSettings,
  options: DevToOptions
}

type Config = {
  github: ConfigGitHub,
  notion: ConfigNotion,
  devto: ConfigDevTo
}

export default Config