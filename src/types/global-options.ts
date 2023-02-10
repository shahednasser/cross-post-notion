import Config from "./config"

type GlobalOptions = {
  config: Config
}

export enum Platforms {
  DEVTO = 'devto',
  HASHNODE = 'hashnode',
  MEDIUM = 'medium',
  GITHUB = 'github'
}

export default GlobalOptions