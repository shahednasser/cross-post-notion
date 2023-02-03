import { DefaultFrontmatter, File, GitHubConnectionSettings, GitHubOptions, ImageDataUrl, GitHubProperties } from "../types/clients/github"

import Notion from "./notion-client"
import { Octokit } from "octokit"
import axios from "axios"
import imageTypes from "../utils/image-types"
import { nanoid } from 'nanoid'
import { ConfigGitHub, ConfigNotion } from '../types/config';

const MARKDOWN_IMG_REGEX = /!\[[^\]]*\]\((.*?)\s*("(?:.*[^"])")?\s*\)/

class GitHubClient {
  octokit: Octokit
  connection_settings: GitHubConnectionSettings
  options: GitHubOptions
  notion: Notion

  constructor (
    config: ConfigGitHub,
    notion_config: ConfigNotion
  ) {
    this.octokit = new Octokit({
      auth: config.connection_settings.token
    })
    this.connection_settings = {
      ...config.connection_settings,
      branch: config.connection_settings.branch ?? "master"
    }
    this.options = config.options
    this.notion = new Notion(notion_config)

    // console.log(this.options, this.connection_settings)
  }

  async post(url: string) {
    //get page id
    const pageId = this.notion.getPageIdFromURL(url)
    //get blocks
    let blocks = await this.notion.getBlocks(url)
    
    const files: File[] = []

    blocks = await Promise.all(blocks.map(async (block) => {
      if (block.type === 'image') {
        //load content of image as base64
        const imageUrl = block.parent.match(MARKDOWN_IMG_REGEX)
        if (imageUrl?.length && imageUrl.length > 1) {
          const imageDataUrl = await this.imageToDataUrl(imageUrl[1])
          if (imageDataUrl) {
            const filename = `${nanoid(10)}.${imageDataUrl.ext}`
            files.push({
              path: `${this.options.image_path}/${filename}`,
              content: imageDataUrl.url
            })

            block.parent = block.parent.replace(imageUrl[1], `${this.options.image_prefix}/${filename}`)
          }
        }
      }

      return block
    }))
    
    //transform blocks to markdown
    let markdown = await this.notion.getMarkdown(blocks)
    const properties = await this.notion.getArticleProperties(pageId)
    const title = this.notion.getAttributeValue(properties[this.options.properties?.title || GitHubProperties.TITLE])

    //add frontmatter
    let frontmatterStr = ''
    if (this.options.add_default_frontmatter || this.options.extra_frontmatter) {
      frontmatterStr = '---\r\n'
    }

    if (this.options.add_default_frontmatter) {
      //add title
      frontmatterStr += `${this.options.frontmatter_labels?.title || DefaultFrontmatter.TITLE}: '${title}'\r\n`
      //add date
      if (this.options.properties?.date) {
        frontmatterStr += `${this.options.frontmatter_labels?.date || DefaultFrontmatter.DATE}: '${this.notion.getAttributeValue(properties[this.options.properties?.date])}'\r\n`
      } else {
        //use current date
        const today = new Date()
        frontmatterStr += `${this.options.frontmatter_labels?.date || DefaultFrontmatter.DATE}: '${today.getFullYear()}-${today.getMonth()}-${today.getDate()}'\r\n`
      }
    }

    if (this.options.extra_frontmatter) {
      for (const [key, value] of Object.entries(this.options.extra_frontmatter)) {
        const frontmatterValue = (this.options.extra_frontmatter_mapper && this.options.extra_frontmatter_mapper[key] 
          && properties[this.options.extra_frontmatter_mapper[key]]) ?
          this.notion.getAttributeValue(properties[this.options.extra_frontmatter_mapper[key]]) || value :
          value
        frontmatterStr += `${key}: ${this.formatFrontmatterValue(frontmatterValue)}\r\n`
      }
    }

    if (this.options.add_default_frontmatter || this.options.extra_frontmatter) {
      frontmatterStr += '---\r\n'
    }

    markdown = frontmatterStr + markdown

    // get slug of file
    let slug
    if (properties[this.options.properties?.slug || GitHubProperties.SLUG]) {
      slug = this.notion.getAttributeValue(properties[this.options.properties?.slug || GitHubProperties.SLUG])

      if (!slug) {
        slug = this.notion.getArticleSlug(title)
      }
    } else {
      slug = this.notion.getArticleSlug(title)
    }

    while (slug.startsWith('/')) {
      slug = slug.substring(1)
    }

    //add markdown file to files
    files.push({
      path: `${this.options.article_path}/${slug}.md`,
      content: this.toBase64(markdown)
    })

    //commit files to GitHub
    for (const file of files) {
      await this.octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
        owner: this.connection_settings.owner,
        repo: this.connection_settings.repo,
        path: file.path,
        content: file.content,
        message: `Added ${file.path}`,
        branch: this.connection_settings.branch
      })
    }

    console.log('Article pushed to GitHub')
  }

  async imageToDataUrl (url: string): Promise<ImageDataUrl | null> {
    const imageDataUrl = await axios.get(url, {
      responseType: 'arraybuffer'
    })
    const stringifiedBuffer = this.toBase64(imageDataUrl.data)
    const contentType = imageDataUrl.headers['content-type']
    
    if (!contentType) {
      console.error('Could not retrieve image. Skipping...')
      return null
    }

    return {
      url: stringifiedBuffer,
      ext: contentType ? imageTypes[contentType] || "" : ""
    }
  }

  toBase64(source: string): string {
    return Buffer.from(source).toString('base64')
  }

  formatFrontmatterValue (value: any) {
    switch (typeof value) {
      case 'string':
        return `'${value.replaceAll(/'/g, '')}'`
      default:
        return value
    }
  }
}

export default GitHubClient