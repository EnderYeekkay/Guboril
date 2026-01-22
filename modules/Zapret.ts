import { spawn, ChildProcess } from 'node:child_process'

import fs from 'node:fs'
import path from 'node:path'
import { app } from 'electron/main'
import { BrowserWindow, shell } from 'electron'
import { EventEmitter } from 'node:events'
import axios from 'axios'

const l = console.log

const destDir = path.join(app.getPath('userData'), 'core');
const originalBat = path.join(destDir, 'service.bat');
const coreDir = path.join(app.getPath('userData'), 'core');
const settingsPath = path.join(app.getPath('userData'), 'settings.json')

export const SettingsLength = 7
export type Settings = {
  gameFilter:          boolean
  autoUpdate:          boolean
  autoLoad:            boolean
  zapretVersion:       string
  selectedStrategyNum: number
  notifications:       boolean
  GH_TOKEN:            string
};
export type ZapretData = {
    gf: 'enabled' | 'disabled'
    v:  string
    cs: 'enabled' | 'disabled'
}
export function resolveDataBooleanLike (value: DataBooleanLike | boolean): boolean | undefined {
    if (typeof value === "boolean") return value
    if (value === 'enabled') return true
    if (value === 'disabled') return false
    return
}
export async function pingGithubAPI(): Promise<boolean>{
    const startTime = Date.now()
    try {
        const res = await axios.get('https://api.github.com')
        l('API responded in ', Date.now() - startTime, ' ms.')
    } catch(e) {
        l('API not responded.')
        return false
    }
    return true
}
export default class Zapret extends EventEmitter{

    static win: BrowserWindow
    child: ChildProcess
    _isBusy = false
    get isBusy() {
        return this._isBusy
    }
    set isBusy(value) {
        this._isBusy = value
        if (!value) this.emit('not_busy')
    }

    output: string = ''

    _patchedBat: string

    constructor() {
        super()

        
        if (Zapret.isInstalled())
        {
            this.child = this.spawnChild()
            this._patchedBat = path.join(destDir, 'service_patched.bat');

            // читаем оригинал
            let code = fs.readFileSync(originalBat, 'utf8');

            // ########### ПАТЧ .bat ###########
            // заменяем ВСЕ вызовы start (...) на call (...)
            code = code.replace(
                /^\s*start\s+(.*)$/gmi,
                'call $1'
            );
            const menuBlockRegex = /set "menu_choice=null"+[\s\S]*?(?=set \/p menu_choice=)/
            code = code.replace(menuBlockRegex, `echo {{"gf": "!GameFilterStatus!", "v": "%LOCAL_VERSION%", "cs":"%CheckUpdatesStatus%"}}\r\n`)

            // удаляем блок CHECK UPDATES целиком
            const checkUpdatesBlockRegex = /:: CHECK UPDATES =======================[\s\S]*?(?=:: DIAGNOSTICS =========================)/i;
            code = code.replace(checkUpdatesBlockRegex, '');

            // удаляем первый блок if "%1"=="admin" (...) else (...)
            const adminBlockRegex =
                /if\s+"%1"=="admin"\s*\([\s\S]*?\)\s*else\s*\([\s\S]*?\)/i;
            code = code.replace(adminBlockRegex, '');
            fs.writeFileSync(this._patchedBat, code);
        } else {
            l('Warning! No core has been detected!')
        }
    }

    async initializeSettings(): Promise<void>{
        const tempData = await this.getData()
        let defaultSettings: Settings = {
            gameFilter: resolveDataBooleanLike(tempData.gf),
            autoLoad: true,
            autoUpdate: false,
            zapretVersion: '0',
            selectedStrategyNum: 11,
            notifications: true,
            GH_TOKEN: null
        }
        console.log('Reinitializing Settings', defaultSettings)
        fs.writeFileSync(settingsPath, JSON.stringify(defaultSettings, null, 2))
    }
    static getSettings(): Settings {
        return JSON.parse(fs.readFileSync(settingsPath).toString())
    }
    static setSettings(data: Partial<Settings>) {
        let old_settings = Zapret.getSettings()
        let new_settings = {...old_settings, ...data}
        this.win.webContents.send('zapret:settingsChanged', new_settings)
        fs.writeFileSync(settingsPath, JSON.stringify(new_settings, null, 2))
    }

    static isInstalled() {
        const serviceBat = path.join(coreDir, 'service.bat');

        try {
            return fs.existsSync(serviceBat);
        } catch {
            return false;
        }
    }

    spawnChild () {
        l('\x1b[32mspawnChild()\x1b[0m')
        if (!Zapret.isInstalled()) throw new Error('Trying to spawn child while core is not installed!')
        this.output = ''
        /**
         * @type {ChildProcess}
         */
        let child = spawn(
                'cmd.exe',
            ['/c', this._patchedBat],
            {
                windowsHide: true,
                stdio: ['pipe', 'pipe', 'pipe']
            }
        )
        child.stdout.on('data', (chunk) => {
            chunk = chunk.toString()
            if (chunk.includes('Press any key')) {
                child.stdin.write('\r', (err) => {
                    if (err != null && err != undefined) throw new ZapretError(`#CONTINUE_WORKING\n${err.stack}`)
                })
            }
            this.output += chunk
            this.emit('out', this.output)
        })
        child.stderr.on('data', (chunk) => {
            chunk = chunk.toString()
            if (chunk.includes('Press any key')) {
                child.stdin.write('\r', (err) => {
                    if (err != null && err != undefined) throw new ZapretError(`#CONTINUE_WORKING\n${err.stack}`)
                })
            }
            this.output += chunk
            this.emit('out', this.output)
        })
        child.stdin.on('error', (err) => {
            l(`Stdin err:\n${err}`)
        })
        child.on('exit', (msg) => {
            console.log('Child exited with msg: ' + msg)
        })
        this.child = child
        return child
    }
    killChild () {
        l('\x1b[31mkillChild()\x1b[0m')
        this.child.kill()
    }
    static async initialize() {

        let res = new this()
        if (!fs.existsSync(settingsPath) || Object.keys(Zapret.getSettings()).length < SettingsLength) {
            res.initializeSettings()
        }
        return res
    }
    write(value) {
        // if(!this.child.stdin.writable) throw new ZapretError('Stdin is unwritable: ' + this.output)
        this.output = ''
        this.isBusy = true
        this.child.stdin.write(`${value.toString()}\n`)
    }

    async getData(): Promise<ZapretData> {
        this.isBusy = true
        if (!Zapret.isInstalled()) return {
            gf: 'disabled',
            v: '0',
            cs: 'disabled'
        }
        this.spawnChild()
        l('\x1b[1;35mgetData()\x1b[0m')
        const handler = (chunk) => {
            if (this.output.includes('Select')) {
                l(this.output)
                this.killChild()
                this.emit('complete')
            }
        }

        this.on('out', handler)
        await EventEmitter.once(this, 'complete')
        this.off('out', handler)

        const data = this.output.match(/\{[^{}]*\}/g)[0]
        if (!data) throw new ZapretError('Empty data')

        const parsedData: ZapretData = JSON.parse(data)
        Zapret.setSettings({
            gameFilter: resolveDataBooleanLike(parsedData.gf),
            zapretVersion: parsedData.v
        })

        this.isBusy = false
        return parsedData
    }

    async switchGameFilter(): Promise<boolean> {
        this.isBusy = true
        this.spawnChild()
        l('\x1b[1;35mswitchGameFilter()\x1b[0m')
        this.write(4)
        let res: boolean = null
        const handler = (chunk) => {
            if (this.output.includes('Disabling')) res = false
            if (this.output.includes('Enabling')) res = true
            if (this.output.includes('Restart')) {
                l(this.output)
                this.killChild()
                this.emit('complete')
            }
        }

        this.on('out', handler)
        await EventEmitter.once(this, 'complete')
        this.off('out', handler)
        if (res === null) throw new ZapretError('Unable to detect game filter status')
        console.log(res.toString().toUpperCase())

        const previousValue = Zapret.getSettings().gameFilter
        Zapret.setSettings({gameFilter: !previousValue})

        this.isBusy = false
        return true
    }

    async getLatestVersion() {
        const repo = 'Flowseal/zapret-discord-youtube';
        l('\x1b[1;35mgetLatestVersion()\x1b[0m')
        const { data: latest } = await axios.get(`https://api.github.com/repos/Flowseal/zapret-discord-youtube/releases/tags/1.9.3`);

        const latestTag = latest.tag_name || latest.name;
        const latestUrl = latest.assets.find(a => a.name.endsWith('.rar'))?.browser_download_url;

        if (!latestUrl) throw new Error('RAR-файл не найден в релизах.');

        return { tag: latestTag, url: latestUrl };
    }

    openCoreFolder() {
        shell.showItemInFolder(originalBat);
    }
    async checkStatus(): Promise<[boolean]>{
        l('\x1b[1;35mcheckStatus()\x1b[0m')
        if (!Zapret.isInstalled()) return [false]
        this.child = this.spawnChild()
        if (this.isBusy) throw new ZapretError('Queue error')
        this.isBusy = true
        const handler = (output) => {
            if (output.includes('RUNNING')) {
                this.emit('complete', true, (output.match(/Service strategy installed from "([^"]+)"/) || [])[1] || null)
                this.killChild()
            }
            if (output.includes('NOT running')) {
                this.emit('complete', false, (output.match(/Service strategy installed from "([^"]+)"/) || [])[1] || null)
                this.killChild()
            }
        }

        this.on('out', handler)
        this.write(3)
        let res = await EventEmitter.once(this, 'complete')
        this.off('out', handler)

        this.isBusy = false
        return res as [boolean]
    }

    async install(strategyNum: number): Promise<[boolean]> {
        l(`\x1b[1;35minstall(${strategyNum})\x1b[0m`)
        if (this.isBusy) throw new ZapretError('Queue error')
        strategyNum = Number(strategyNum)

        if (isNaN(strategyNum)) throw new ZapretError(`strategyNum must be number, but it is: ${strategyNum}`)
        this.spawnChild()
        this.write(1)
        const handler = (output) => {
            if (output.includes('Input')) this.emit('complete', true)
        }
        this.on('out', handler)
        await EventEmitter.once(this, 'complete')
        this.off('out', handler)
        const resHandler = (output) => {
            if (output.includes('successfully')) this.emit('complete', true)
            if (output.includes('denied') || output.includes('Invalid') || output.includes('STOP_PENDING')) this.emit('complete', false)
        }

        this.write(strategyNum)
        this.on('out', resHandler)
        const res = await EventEmitter.once(this, 'complete')
        this.off('out', resHandler)
        this.killChild()
        this.isBusy = false
        l(res)
        Zapret.setSettings({selectedStrategyNum: strategyNum})
        return res as [boolean]
    }
    async remove() {
        l(`\x1b[1;35mremove()\x1b[0m`)
        if (this.isBusy) throw new ZapretError('Queue error')

        this.spawnChild()
        this.write(2)
        const handler = (output) => {
            if (output.includes('Press any')) this.emit('complete', true)
        }
        this.on('out', handler)
        let res = await EventEmitter.once(this, 'complete')
        this.off('out', handler)
        this.killChild()
        this.isBusy = false
        return res
    }
    async getAllStrategies(): Promise<string[]> {
        l('\x1b[1;35mgetAllStrategies()\x1b[0m')
        if (!Zapret.isInstalled()) return []
        this.spawnChild()
        if (this.isBusy) throw new ZapretError('Queue error');
        const handler = async (output) => {
            if (output.includes('Input')) {
                const matches = [...output.matchAll(/(general(?: \([^)]+\))?\.bat)/gi)];
                const strategies = matches.map(m => m[1].trim());
                this.emit('complete', strategies)
            }
        };
        this.on('out', handler);
        this.write(1)
        let res = await EventEmitter.once(this, 'complete');
        this.off('out', handler);
        l(res[0])
        this.isBusy = false;
        this.killChild()
        return res[0];
    }

    /**
     * Удалить ядро из статической памяти
     */
    async uninstallCore(): Promise<any | boolean> {
        if (!(await pingGithubAPI())) return false
        try {
            await this.remove()
            fs.rmSync(destDir, {
                recursive: true,
                force: true,
                maxRetries: 10,
                retryDelay: 300
            })
        } catch (e) {
            return e
        }
        Zapret.setSettings({zapretVersion: '0', selectedStrategyNum: 11})
        return true
    }
}

class ZapretError extends Error {
    constructor(message: any) {
        super(message);          // Передаём сообщение в базовый Error
        this.name = this.constructor.name; // Имя класса как имя ошибки
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor); // Корректный стек
        }
    }

}