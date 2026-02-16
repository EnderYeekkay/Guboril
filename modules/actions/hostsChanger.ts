import fs from 'fs'
const url = 'https://raw.githubusercontent.com/Flowseal/zapret-discord-youtube/refs/heads/main/.service/hosts'
import { checkInternet, checkUrl } from '../Core/ConnectionChecker.ts'
import path from 'path';
import { windowsPath } from '../Core/paths.ts'
import { exec, execSync } from 'child_process';
import { dialog } from 'electron';

const hostsPath = path.join(windowsPath, 'System32', 'drivers', 'etc', 'hosts')
let win: Electron.BaseWindow
export function isChanged() {
    return fs.readFileSync(hostsPath).includes('# GUBORIL')
}
export async function change(): Promise<boolean> {
    if (!win) throw new Error('No window!')
    console.log('Updating hosts file')
    if (!(await checkUrl('https://raw.githubusercontent.com/', 5_000))) {
        console.error('Failed connect to https://raw.githubusercontent.com/')
        return false
    }

    const hostsListRaw = await (await fetch(url)).text()
    const cleanedHost = getCleanHosts(hostsListRaw)
    if (!askUserPermission(cleanedHost)) return
    const oldHostsFile = fs.readFileSync(hostsPath)
    if (oldHostsFile.includes('# GUBORIL')) {
        console.warn('Already updated')
        return true
    }
    const newHostsFile = oldHostsFile +
    '\n\n# GUBORIL (НЕ ИЗМЕНЯТЬ ЭТОТ КОММЕНТАРИЙ! / DO NOT CHANGE THIS COMMENT!)\n' +
    cleanedHost +
    '\n# GUBORIL END\n'
    console.log('Writing new hosts file...')
    fs.writeFileSync(hostsPath, newHostsFile)
    console.log('Cleaning DNS cache...')
    exec('ipconfig /flushdns')
    return true
}

export function remove(): boolean {
    try {
        console.log('Cleaning GUBORIL from hosts file...');
        if (!isChanged()) {
            console.warn('Hosts is already cleared!')
        }
        
        const currentHosts = fs.readFileSync(hostsPath, 'utf8');
        
        // Регулярка ищет блок от начала комментария до конца, включая переносы строк (флаг s)
        const guborilRegex = /# GUBORIL[\s\S]*?# GUBORIL END\s*/g;

        if (!guborilRegex.test(currentHosts)) {
            console.log('GUBORIL block not found, nothing to clean.');
            return true;
        }

        // Заменяем найденный блок на пустую строку и убираем лишние пробелы в конце файла
        const cleanedContent = currentHosts.replace(guborilRegex, '').trimEnd() + '\n';

        fs.writeFileSync(hostsPath, cleanedContent);
        
        console.log('Hosts file cleaned. Flushing DNS...');
        exec('ipconfig /flushdns');
        
        return true;
    } catch (error) {
        console.error('Failed to clean hosts file:', error);
        return false;
    }
}

function getCleanHosts(rawData: string): string {
  const regex = /^(?:\d{1,3}\.){3}\d{1,3}\s+[a-z0-9.-]+\.[a-z]{2,10}/gim;

  const matches = rawData.match(regex);

  return matches ? matches.join('\n') : '';
}
async function askUserPermission(cleanedHosts) {
    const result = await dialog.showMessageBox({
        type: 'warning',
        title: 'Подтверждение изменений',
        message: 'Приложение хочет обновить файл hosts. Вы берёте на себя всю ответственность за последствия. Проверьте список доменов:',
        detail: cleanedHosts, // Показываем сам список
        buttons: ['Применить', 'Отмена'],
        defaultId: 0,
        cancelId: 1,
        noLink: true,
        
    });

    return result.response === 0; // true, если нажал "Применить"
}


const Hosts = {
    change,
    remove,
    isChanged,
    win
}
export default Hosts
