import { remove_cli } from '../modules/cli/cli.ts'
import SCController, { options, sleepSync } from '../modules/Core/SCController.ts'
import { spawnSync } from 'child_process'
export default function execute() {
    console.log('beforeInstall')
    SCController.delete()
    spawnSync('sc', ['stop', 'WinDivert'])
    let attempts = 0;
    let flag = false
    while (attempts < 15) { // Ждем максимум 3 секунды (15 * 200мс)
        const query = spawnSync('sc', ['query', 'WinDivert'], options);
        const output = query.stdout?.toString() || '';
        // Если служба перешла в статус STOPPED
        if (output.includes('STOPPED')) {
            flag = true;
        }

        // Если службы вообще нет (кто-то удалил её параллельно)
        if (query.status === 1060) flag = true;

        // Небольшая пауза перед следующей проверкой
        sleepSync(200)
        attempts++;
    }
    if (!flag) throw new Error('Can\'t remove service WinDivert')
    spawnSync('sc', ['delete', 'WinDivert'])
    remove_cli()
}