import Notion from "./notion-client"
import { Octokit } from "octokit"
import axios from "axios"
import imageTypes from "../utils/image-types"
import { nanoid } from 'nanoid'

type GitHubOptions = {
  owner: string
  repo: string
  branch?: string
  image_path?: string
  article_path?: string
  image_prefix?: string
  title_property: string
  date_property: string
  frontmatter: FrontmatterOptions
}

type File = {
  path: string
  content: string
}

type ImageDataUrl = {
  url: string
  ext: string
}

export type FrontmatterOptions = {
  title?: string
  date?: string
}

const MARKDOWN_IMG_REGEX = /!\[[^\]]*\]\((.*?)\s*("(?:.*[^"])")?\s*\)/

class GitHubClient {
  octokit: Octokit
  options: GitHubOptions
  notion: Notion

  constructor (frontmatterOptions?: FrontmatterOptions) {
    this.octokit = new Octokit({
      auth: process.env.GH_TOKEN
    })
    this.options = {
      owner: process.env.GH_OWNER ?? "",
      repo: process.env.GH_REPO ?? "",
      branch: process.env.GH_BRANCH ?? "master",
      image_path: process.env.GH_IMAGE_PATH,
      article_path: process.env.GH_ARTICLE_PATH,
      image_prefix: process.env.GH_IMAGE_PREFIX ?? process.env.GH_IMAGE_PATH,
      title_property: process.env.GH_TITLE_PROPERTY ?? "",
      date_property: process.env.GH_DATE_PROPERTY ?? "",
      frontmatter: {
        title: frontmatterOptions?.title ?? "title",
        date: frontmatterOptions?.date ?? "date"
      }
    }
    this.notion = new Notion()
  }

  async post(url: string, addFrontmatter = false, additionalFrontmatter?: Record<string, any>) {
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
          const filename = `${nanoid(10)}.${imageDataUrl.ext}`
          files.push({
            path: `${this.options.image_path}/${filename}`,
            content: imageDataUrl.url
          })

          block.parent = block.parent.replace(imageUrl[1], `${this.options.image_prefix}/${filename}`)
        }
      }

      return block
    }))
    
    //transform blocks to markdown
    let markdown = await this.notion.getMarkdown(blocks)
    const properties = await this.notion.getArticleProperties(pageId)
    const title = this.notion.getAttributeValue(properties[this.options.title_property])

    //add frontmatter
    let frontmatterStr = ''
    if (addFrontmatter || additionalFrontmatter) {
      frontmatterStr = '---\r\n'
    }

    if (additionalFrontmatter) {
      for (const [key, value] of Object.entries(additionalFrontmatter)) {
        frontmatterStr += `${key}: ${value}\r\n`
      }
    }

    if (addFrontmatter) {
      //add title
      frontmatterStr += `${this.options.frontmatter.title}: ${title}\r\n`
      //add date
      if (this.options.date_property.length) {
        frontmatterStr += `${this.options.frontmatter.date}: ${this.notion.getAttributeValue(properties[this.options.date_property])}\r\n`
      } else {
        //use current date
        const today = new Date()
        frontmatterStr += `${this.options.frontmatter.date}: ${today.getFullYear()}-${today.getMonth()}-${today.getDate()}\r\n`
      }
    }

    if (addFrontmatter || additionalFrontmatter) {
      frontmatterStr += '---\r\n'
    }

    markdown = frontmatterStr + markdown

    // get slug of file
    const slug = this.notion.getArticleSlug(title)

    //add markdown file to files
    files.push({
      path: `${this.options.article_path}/${slug}.md`,
      content: this.toBase64(markdown)
    })

    //commit files to GitHub
    for (const file of files) {
      await this.octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
        owner: this.options.owner,
        repo: this.options.repo,
        path: file.path,
        content: file.content,
        message: `Added ${file.path}`,
        branch: this.options.branch
      })
    }

    console.log('Article pushed to GitHub')
  }

  async imageToDataUrl (url: string): Promise<ImageDataUrl> {
    const imageDataUrl = await axios.get(url, {
      responseType: 'arraybuffer'
    })
    const stringifiedBuffer = this.toBase64(imageDataUrl.data)
    const contentType = imageDataUrl.headers['content-type']
    return {
      url: stringifiedBuffer,
      ext: contentType ? imageTypes[contentType] || "" : ""
    }
  }

  toBase64(source: string): string {
    return Buffer.from(source).toString('base64')
  }
}

export default GitHubClient