
import { remove_cli } from '../modules/cli/cli.ts'
export default function execute() {
    console.log('beforeInstall')
    remove_cli()
}