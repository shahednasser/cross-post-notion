import dotenv from "dotenv"
import post from "./commands/post"
import { program } from 'commander'

dotenv.config()

program.usage('[command] [options]')

program
  .command('post <url>')
  .description('Cross post article')
  .option('--addFrontmatter', 'An option indicating if frontmatter attributes like title and date should automatically be added')
  .option(
    '--frontmatterTitle <title>',
    'The name of the title property used in the generated frontmatter. This is only applied when `--addFrontmatter` is used.',
    'title'
  )
  .option(
    '--frontmatterDate <date>', 
    'The name of the date property used in the generated frontmatter. This is only applied when `--addFrontmatter` is used.',
    'date'
  )
  .option('--frontmatter <value>', 'A JSON object with key-value pairs of frontmatter attributes to add to GitHub file')
  .action(post)

program.parse()