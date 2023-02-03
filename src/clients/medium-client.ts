import axios, { AxiosInstance } from "axios"
import { MediumConnectionSettings, MediumOptions, MediumProperties } from "../types/clients/medium"
import { ConfigMedium, ConfigNotion } from "../types/config"
import Notion from "./notion-client"

class MediumClient {
  connection_settings: MediumConnectionSettings
  options: MediumOptions
  notion: Notion
  client: AxiosInstance

  constructor (
    config: ConfigMedium,
    notion_config: ConfigNotion
  ) {
    this.connection_settings = config.connection_settings
    this.options = config.options || {}
    this.notion = new Notion(notion_config)

    this.client = axios.create({
      baseURL: 'https://api.medium.com/v1/',
      headers: {
        Authorization: `Bearer ${this.connection_settings.token}`
      }
    })
  }

  async post (url: string) {
     //get page id
     const pageId = this.notion.getPageIdFromURL(url)
     //get blocks
     const blocks = await this.notion.getBlocks(url)
 
     //transform blocks to markdown
     let markdown = await this.notion.getMarkdown(blocks)
     const properties = await this.notion.getArticleProperties(pageId)
     
     //get user ID
     const { data: { data: { id } } } = await this.client.get('me')

     let requestPath = `users/${id}/posts`
     if (this.connection_settings.publication_name) {
      //get publication id
      const { data: { data } } = await this.client.get(`users/${id}/publications`)

      const publication = data.find((pub: Record<string, string>) => pub.name === this.connection_settings.publication_name)

      if (publication) {
        requestPath = `publications/${publication.id}/posts`
      }
     }

     //get post title and add it to the top of the markdown content
     const title = this.notion.getAttributeValue(properties[this.options.properties?.title || MediumProperties.TITLE])
     markdown = `# ${title}\r\n\r\n${markdown}`

     await this.client.post(requestPath, {
      title,
      contentFormat: 'markdown',
      content: markdown,
      tags: this.notion.getAttributeValue(properties[this.options.properties?.tags || MediumProperties.TAGS]).split(",").map((tag) => tag.trim()),
      canonicalUrl: this.notion.getAttributeValue(properties[this.options.properties?.canonical_url || MediumProperties.CANONICAL_URL]),
      publishStatus: this.options.should_publish ? 'public' : 'draft',
      notifyFollowers: this.options.should_notify_followers
     })

     console.log('Article pushed to Medium')
  }
}

export default MediumClient