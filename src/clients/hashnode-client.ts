import { GraphQLClient, gql } from 'graphql-request'
import { HashnodeConnectionSettings, HashnodeOptions, HashnodeProperties } from "../types/clients/hashnode";
import { ConfigHashnode, ConfigNotion } from "../types/config";
import Notion from './notion-client';

type HashnodeTag = {
  _id: string,
  slug: string,
  name: string
}

class HashnodeClient {
  connection_settings: HashnodeConnectionSettings
  options: HashnodeOptions
  notion: Notion
  client: GraphQLClient

  constructor (
    config: ConfigHashnode,
    notion_config: ConfigNotion
  ) {
    this.connection_settings = config.connection_settings
    this.options = config.options || {}
    this.notion = new Notion(notion_config)
    
    this.client = new GraphQLClient('https://api.hashnode.com', {
      headers: {
        authorization: this.connection_settings.token
      }
    })
  }

  async post (url: string) {
    //get page id
    const pageId = this.notion.getPageIdFromURL(url)
    //get blocks
    const blocks = await this.notion.getBlocks(url)

    //transform blocks to markdown
    const markdown = await this.notion.getMarkdown(blocks)
    const properties = await this.notion.getArticleProperties(pageId)

    const canonical_url = this.notion.getAttributeValue(properties[this.options.properties?.original_article_url || HashnodeProperties.ORIGINAL_ARTICLE_URL])

    //get tags
    let tags: HashnodeTag[] = []
    const notionTags = this.notion.getAttributeValue(properties[this.options.properties?.tags || HashnodeProperties.TAGS])
    if (notionTags) {
      tags = await this.getTagsFromHashnode(notionTags.split(",").map((tag) => tag.trim()))
    }

    const createStoryInput = {
      title: this.notion.getAttributeValue(properties[this.options.properties?.title || HashnodeProperties.TITLE]),
      contentMarkdown: markdown,
      subtitle: this.notion.getAttributeValue(properties[this.options.properties?.subtitle || HashnodeProperties.SUBTITLE]),
      ...(canonical_url && {
        isRepublished: {
          originalArticleUrl: canonical_url
        }
      }),
      tags,
      isPartOfPublication: {
        publicationId: this.connection_settings.publication_id
      }
    }


    //post to personal
    const mutation = gql`
      mutation createPublicationStory($input: CreateStoryInput!, $publicationId: String!, $hideFromHashnodeFeed: Boolean!) {
        createPublicationStory(input: $input, publicationId: $publicationId, hideFromHashnodeFeed: $hideFromHashnodeFeed) {
          success,
          message
        }
      }
    `
    
    const data = {
      input: createStoryInput,
      publicationId: this.connection_settings.publication_id,
      hideFromHashnodeFeed: this.options.should_hide
    }

    await this.client.request(mutation, data)

    console.log('Article pushed to Hashnode')
  }

  async getTagsFromHashnode (tags: string[]): Promise<HashnodeTag[]> {
    const hashnodeTags: HashnodeTag[] = []
    //retrieve all tags from hashnode
    const query = gql`
      {
        tagCategories {
          _id,
          name,
          slug
        }
      }
    `

    const response = await this.client.request(query)

    tags.forEach((tag) => {
      //find tag in the response
      const hashnodeTag = response.tagCategories?.find((t: HashnodeTag) => t.name === tag || t.slug === tag)

      if (hashnodeTag) {
        hashnodeTags.push(hashnodeTag)
      }
    })

    return hashnodeTags
  }
}

export default HashnodeClient