# Cross Post Tool for Notion

This tool allows posting from Notion to different platforms.

## Platforms

- [x] GitHub (Markdown)
  - [ ] frontmatter customization
- [ ] Dev.to
- [ ] Hashnode
- [ ] Medium

## Configurations

### Notion

- `NOTION_TOKEN`: Token on a Notion internal integration

### GitHub

- `GH_TOKEN`: (required) GitHub personal token
- `GH_OWNER`: (required) GitHub username
- `GH_REPO`: (required) Repository name
- `GH_BRANCH`: Branch name. default is `master`.
- `GH_IMAGE_PATH`: Path to upload images to in the repository. Default will be the root.
- `GH_IMAGE_PREFIX`: Prefix of images to use in the article. This is helpful if, for example, you host images in the `public` directory but on the website the images should be loaded from `/`. Default value is the same value as `GH_IMAGE_PATH`.
- `GH_ARTICLE_PATH`: Path to upload the article to in the repository. Default will be the root.
- `GH_TITLE_PROPERTY`: The Notion property to take the title from. Default will be the title of the notion document.

## Usage

Run the following command after clonning the repository:

```bash
yarn start <url>
```

Where `<url>` is the URL of the Notion document