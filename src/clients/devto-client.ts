import { ConfigDevTo, ConfigNotion } from './../types/config';
import { DevToConnectionSettings, DevToOptions, DevToProperties } from "../types/clients/devto";
import Notion from "./notion-client";
import axios, { AxiosInstance } from 'axios';

type ArticleData = {
  body_markdown: string,
  organization_id?: string,
  published: boolean,
  title: string,
  series?: string,
  description?: string,
  canonical_url?: string,
  tags?: string[],
  date?: string
}

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

  async post (url: string, dryRun?: boolean) {
    //get page id
    const pageId = this.notion.getPageIdFromURL(url)
    //get blocks
    const blocks = await this.notion.getBlocks(url)

    //transform blocks to markdown
    const markdown = await this.notion.getMarkdown(blocks)
    const properties = await this.notion.getArticleProperties(pageId)
    
    //format data
    const article: ArticleData = {
      body_markdown: markdown,
      organization_id: this.connection_settings.organization_id,
      published: this.options.should_publish,
      title: ''
    }
    Object.entries(DevToProperties).forEach(([, value]) => {
      const propertyName = this.options.properties && this.options.properties[value] ? 
        this.options.properties[value] :
        value
      const attributeValue = this.notion.getAttributeValue(properties[propertyName])
      if (!attributeValue.length) {
        return
      }
      article[value] = this.formatValue(value, attributeValue)
    })

    if (dryRun) {
      console.log('No error occurred while preparing article for dev.to.')
      return
    }

    //push to dev.to
    await this.client.post('articles', {
      article
    })

    console.log('Article pushed to Dev.to')
  }

  formatValue (name: string, value: string): any {
    switch (name) {
      case 'tags':
        return value.split(',')
      default:
        return value
    }
  }
}

export default DevToClient