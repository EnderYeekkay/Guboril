// @ts-ignore
import { init_cli } from '../modules/cli.ts'
export default function execute() {
    console.log('afterInstall')
    init_cli()
}