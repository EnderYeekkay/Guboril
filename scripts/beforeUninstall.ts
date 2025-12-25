// @ts-ignore
import { remove_cli } from '../modules/cli.ts'
export default function execute() {
    console.log('beforeInstall')
    remove_cli()
}