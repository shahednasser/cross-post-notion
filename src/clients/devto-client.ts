import { ConfigDevTo, ConfigNotion } from './../types/config';
import { DevToConnectionSettings, DevToOptions, DevToProperties } from "../types/clients/devto";
import Notion from "./notion-client";
import axios, { AxiosInstance } from 'axios';

class DevToClient {
  connection_settings: DevToConnectionSettings
  options: DevToOptions
  notion: Notion
  client: AxiosInstance

  constructor (
    config: ConfigDevTo,
    notion_config: ConfigNotion
  ) {
    this.connection_settings = config.connection_settings
    this.options = config.options || {}
    this.notion = new Notion(notion_config)

    this.client = axios.create({
      baseURL: 'https://dev.to/api/',
      headers: {
        'api-key': this.connection_settings.api_key
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
    
    //format frontmatter
    let frontmatter = '---\r\n'
    frontmatter += `published: ${this.options.should_publish}\r\n`
    Object.entries(DevToProperties).map(([, value]) => {
      const propertyName = this.options.properties && this.options.properties[value] ? 
        this.options.properties[value] :
        value
      frontmatter += `${value}: ${this.notion.getAttributeValue(properties[propertyName])}\r\n`
    })

    frontmatter += '---\r\n'
    markdown = frontmatter + markdown

    //push to dev.to
    await this.client.post('articles', {
      article: {
        body_markdown: markdown,
        organization_id: this.connection_settings.organization_id
      }
    })

    console.log('Article pushed to Dev.to')
  }
}

export default DevToClient