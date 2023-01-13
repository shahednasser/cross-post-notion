# Cross Post Tool for Notion

This tool allows posting from Notion to different platforms.

## Platforms

- [x] GitHub (Markdown)
  - [x] frontmatter customization
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
- `GH_TITLE_PROPERTY`: The name of the Notion property to take the title from. Default will be the title of the notion document.
- `GH_DATE_PROPERTY`: The name of the Notion property to take the date from. If no property is provided, the current date is used as the value.

## Usage

Run the following command after clonning the repository:

```bash
yarn start <url>
```

Where `<url>` is the URL of the Notion document.

### Options

| name  | description  | default |
|---  |---  |---  |
| `--addFrontmatter`  | Whether to automatically add title and date frontmatter  | false |
| `--frontmatterTitle <title>`  | The name of the title property used in the generated frontmatter. This is only applied when `--addFrontmatter` is used.  | "title" |
| `--frontmatterDate <date>`  | The name of the date property used in the generated frontmatter. This is only applied when `--addFrontmatter` is used.   | "date"  |
| `--frontmatter <value>`   | A JSON object with key-value pairs of frontmatter attributes to add to the GitHub file. For example `"{\"test\": true}"`.   | {}  |
