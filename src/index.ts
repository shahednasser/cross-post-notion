import dotenv from "dotenv"
import post from "./commands/post"
import { program } from 'commander'

dotenv.config()

program.usage('[command] [options]')

program
  .command('post <url>')
  .description('Cross post article')
  .action(post)

program.parse()