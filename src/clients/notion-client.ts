import { Client } from "@notionhq/client";
import { MdBlock } from "notion-to-md/build/types";
import { NotionToMarkdown } from "notion-to-md";
import slugify from "slugify";
import { ConfigNotion } from "../types/config";

class Notion {
  notion: Client;
  n2m: NotionToMarkdown;
  
  constructor (config: ConfigNotion) {
    this.notion = new Client({
      auth: config.connection_settings.token,
    });
    this.n2m = new NotionToMarkdown({
      notionClient: this.notion
    })
  }

  async getBlocks (url: string): Promise<MdBlock[]> {
    const pageId = this.getPageIdFromURL(url)
    return this.n2m.pageToMarkdown(pageId);
  }

  async getMarkdown (source: string | MdBlock[]): Promise<string> {
    let mdblocks: MdBlock[] = []
    if (typeof source === 'string') {
      const pageId = this.getPageIdFromURL(source)
      mdblocks = await this.n2m.pageToMarkdown(pageId);
    } else {
      mdblocks = source
    }

    return this.n2m.toMarkdownString(mdblocks);
  }

  async getArticleProperties(page_id: string): Promise<Record<string, any>> {
    const response = await this.notion.pages.retrieve({
      page_id
    })

    //due to an issue in Notion's types we disable ts for this line
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return response.properties
  }

  getArticleSlug(title: string): string {
    return `${encodeURI(slugify(title.toLowerCase()))}`
    return `${slugify(title.toLowerCase())}`
  }

  getAttributeValue (attribute: Record<string, any>): string {
    switch (attribute.type) {
      case 'title':
        return attribute.title.plain_text
      case 'rich_text':
        return attribute.rich_text[0]?.plain_text || ""
      case 'date':
        return attribute.date.start
      default:
        return ""
    }
  }

  // Read more details in Notion's documentation:
  // https://developers.notion.com/docs/working-with-page-content#creating-a-page-with-content
  getPageIdFromURL(url: string): string {
    const urlArr = url.split('-'),
      unformattedId = urlArr[urlArr.length - 1]
    
    if (unformattedId.length !== 32) {
      throw Error('Invalid ID. Length of ID should be 32 characters')
    }
    
    return `${unformattedId.substring(0, 8)}-${unformattedId.substring(8, 12)}-` + 
    `${unformattedId.substring(12, 16)}-${unformattedId.substring(16, 20)}-` +
    `${unformattedId.substring(20)}`
  }
}

export default Notion