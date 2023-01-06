import { Client } from "@notionhq/client";
import { MdBlock } from "notion-to-md/build/types";
import { NotionToMarkdown } from "notion-to-md";
import { nanoid } from 'nanoid'
import slugify from "slugify";

class Notion {
  notion: Client;
  n2m: NotionToMarkdown;
  
  constructor () {
    this.notion = new Client({
      auth: process.env.NOTION_TOKEN,
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

  async getArticleSlug(page_id: string, key?: string): Promise<string> {
    const response = await this.notion.pages.retrieve({
      page_id
    })

    //due to an issue in Notion's types we disable ts for this line
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const typeKey = key ? response.properties[key].type : 'title'
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const title = key ? response.properties[key][typeKey][0].plain_text : response.properties['Article name'].title.plain_text

    return `${slugify(title)}-${nanoid(10)}`
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