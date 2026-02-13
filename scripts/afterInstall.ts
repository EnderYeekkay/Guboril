
import { init_cli } from '../modules/cli/cli.ts'
export default function execute() {
    console.log('afterInstall')
    init_cli()
}