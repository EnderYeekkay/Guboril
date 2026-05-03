import fs from 'fs'
import path from 'path'
import { app, BrowserWindow } from 'electron'
import SCController from './SCController.ts'
import { checkTask } from '../actions/scheduler.ts'
import type { StrategyFullName } from './Strategies/Strategy.ts'
import { coreDir } from './paths.ts'
const settingsPath = path.join(app.getPath('userData'), 'settings.json')
export const SettingsLength = 7


export type Settings = {
    gameFilter: {
        legacy:    Readonly<boolean>
        TCP:       Readonly<boolean>
        UDP:       Readonly<boolean>
    }
    autoUpdate:          boolean
    autoLoad:            boolean
    status:              boolean
    selectedStrategy:    number | null
    notifications:       boolean
    GH_TOKEN:            string | null
};
let cachedSettings: Settings
let writingQueue = Promise.resolve();
export class SettingsAccessor {
    static mainWindow: BrowserWindow
    constructor() {
        this.initialize()
        cachedSettings = JSON.parse(fs.readFileSync(settingsPath).toString())
        this.settings = {
            status: SCController.checkService(),
            autoLoad: checkTask()
        }
    }
    initialize() {
        if (!fs.existsSync(settingsPath)) {
            let defaultSettings: Settings = {
                gameFilter: {
                    legacy: false,
                    TCP: false,
                    UDP: false
                },
                autoLoad: true,
                autoUpdate: false,
                status: false,
                selectedStrategy: fs.statSync(path.resolve(coreDir, 'general (SIMPLE FAKE).bat')).ino,
                notifications: true,
                GH_TOKEN: null
            }
            console.log('Reinitializing Settings', defaultSettings)
            fs.writeFileSync(settingsPath, JSON.stringify(defaultSettings, null, 2))
        }
    }
    get settings(): Settings {
        return {...cachedSettings}
    }

    set settings(data: Partial<Settings>) {
        const keys = Object.keys(data) as Array<keyof Settings>;
        const hasChange = keys.some(key => cachedSettings[key] !== data[key]);
        if (!hasChange) return

        cachedSettings = {...cachedSettings, ...data}
        SettingsAccessor.mainWindow?.webContents.send('core:settingsChanged', cachedSettings)
        writingQueue = writingQueue.then(() => fs.promises.writeFile(settingsPath, JSON.stringify(cachedSettings, null, 2)))
    }

}
const settingsAccessor = new SettingsAccessor()
const settings = new Proxy({}, {
    get(_, key: keyof Settings) {
        return (settingsAccessor.settings)[key];
    },
    set(_, key: keyof Settings, value) {
        settingsAccessor.settings = { [key]: value };
        return true;
    },
    ownKeys() {
        return Reflect.ownKeys(cachedSettings)
    },
    getOwnPropertyDescriptor(_, prop: keyof Settings) {
        return {
            enumerable: true,
            configurable: true
        }
    }
}) as Settings

export { settings }
