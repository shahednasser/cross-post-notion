# Cross Post Tool for Notion

This tool allows posting from Notion to different platforms.

## Platforms

- [x] GitHub (Markdown)
  - [x] frontmatter customization
- [x] Dev.to
- [ ] Hashnode
- [ ] Medium

## Environment Variables

### Notion

- `NOTION_TOKEN`: Token on a Notion internal integration

### GitHub

- `GH_TOKEN`: (required) GitHub personal token
- `GH_OWNER`: (required) GitHub username
- `GH_REPO`: (required) Repository name
- `GH_BRANCH`: Branch name. default is `master`.

### Dev.to

- `DEVTO_API_KEY`: (required) Your personal dev.to API key. Learn how to retrieve it [here](https://developers.forem.com/api/v0).
- `DEVTO_ORG_ID`: The organization to publish the article under. You can retrieve it either from the organization dashboard page, where the ID is the last part of the URL (`https://dev.to/dashboard/organization/ORG_ID`). Alternatively, you can use Dev.to's [List Organizations](https://developers.forem.com/api/v0#tag/organizations/operation/getOrgUsers) endpoint to find the ID.

## Usage

Run the following command after clonning the repository:

```bash
yarn start <url>
```

Where `<url>` is the URL of the Notion document.

## Config

By default, this tool will look for configurations under `config/default.json` or `config/local.json`. You can also pass the `-c, --config` option to load configurations from a different JSON file.

For example:

```bash
yarn start <url> -c path/to/file.json
```

### Available Configurations

The JSON configuration file can have the following fields:

```json
{
  "config": {
    "notion": {
      "options": {
        "skip_block_types": [
        
        ]
      }
    },
    "github": {
      "options": {
        "image_path": "public",
        "image_prefix": "/",
        "article_path": "content",
        "properties": {
          "title": "Title for Blog",
          "date": "Publishing Date",
          "slug": "Slug"
        },
        "add_default_frontmatter": true,
        "frontmatter_labels": {
          "title": "title",
          "date": "date"
        },
        "extra_frontmatter": {
          "excerpt": "this is description"
        },
        "extra_frontmatter_mapper": {
          "excerpt": "Description"
        }
      }
    },
    "devto": {
      "options": {
        "should_publish": false,
        "properties": {
          "title": "Title for Dev.to",
        }
      }
    }
  }
}
```

Where:

- `config`: wraps all configurations.
- `github`: A JSON object with all configurations related to GitHub. These are:
  - `options`: Include all options related to cross posting:
    - `image_path`: The path in the repository to upload images to.
    - `image_prefix`: The prefix to add to images in the markdown output.
    - `article_path`: The path in the repository to upload the markdown article to.
    - `add_default_frontmatter`: Whether to add default frontmatter to the markdown file. The default frontmatter are:
      - `title`
      - `date`
      - `slug`
    - `properties`: A JSON object that allows you to override the name of the properties in Notion to pull the values of frontmatter fields.
    - `frontmatter_labels`: A JSON object that allows you to override the labels of the frontmatter fields.
    - `extra_frontmatter`: Allows you to add extra frontmatter to the output markdown.
    - `extra_frontmatter_mapper`: If you want the values of the frontmatter keys in `extra_frontmatter` to be pulled out of Notion, you can map each key to a property name in the Notion document.
- `devto`: A JSON object with all configurations related to Dev.to. These are:
  - `should_publish`: A boolean value indicating whether the article should be created in dev.to as a draft or it should be published.
  - `properties`: A JSON object that allows you to override the name of the properties in Notion to pull the values of frontmatter fields. You can set the following properties:
    - `title`
    - `date`
    - `description`
    - `tags`
    - `series`
    - `canonical_url`
    - `description`

### Environment Variables when Loading Configurations from a Custom File

When you're loading configurations from a custom file using the `-c, --config` option, you can't use the environment variables anymore. You'll have to pass them in the same config file as follows:

```json
{
  "config": {
    "notion": {
      "connection_settings": {
        "token": "..."
      }
    },
    "github": {
      //...
      "connection_settings": {
        "token": "...",
        "owner": "...",
        "repo": "...",
        "branch": "..."
      }
    },
    "devto": {
      //...
      "connection_settings": {
        "api_key": "...",
        "organization_id": "..."
      }
    }
  }
}
```

## Limitations

### Dev.to

- As Dev.to does not expose an endpoint to upload images, it's not possible to upload images in the article. You'll have to upload them manually from Dev.to's interface.