import { MediumConnectionSettings, MediumOptions } from './clients/medium';
import { HashnodeConnectionSettings, HashnodeOptions } from './clients/hashnode';
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

export type ConfigHashnode = {
  connection_settings: HashnodeConnectionSettings,
  options: HashnodeOptions
}

export type ConfigMedium = {
  connection_settings: MediumConnectionSettings,
  options: MediumOptions
}

type Config = {
  github: ConfigGitHub,
  notion: ConfigNotion,
  devto: ConfigDevTo,
  hashnode: ConfigHashnode,
  medium: ConfigMedium
}

export default Config