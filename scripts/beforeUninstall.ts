
import { remove_cli } from '../modules/cli/cli.ts'
import Hosts from '../modules/actions/hostsChanger.ts'
export default function execute() {
    console.log('beforeInstall')
    Hosts.remove()
    remove_cli()
}