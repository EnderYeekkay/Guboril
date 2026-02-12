import { EventEmitter } from 'node:events'
import { resolve as pr } from 'node:path'
import { BrowserWindow, shell } from 'electron'
import * as paths from './paths.ts'
import fs from 'fs'
import SCController from './SCController.ts'
import strategyParser from './strategyParser.ts'
import { SettingsAccessor, settings, type Settings } from './Settings.ts'
const { log } = console
/** Absoulte path of some file.*/ type path = string

SCController.enableTimestampsTCP()

export default interface CoreEvents {
    strategyChanged: [strategy: string | null]
    gameFilterChanged: [value: boolean]
}
type EventArg<T> = Extract<T, readonly unknown[]>
type CoreEmitter = EventEmitter & {
    emit<K extends keyof CoreEvents>(event: K, ...args: EventArg<CoreEvents[K]>): boolean
    on<K extends keyof CoreEvents>(event: K, listener: (...args: EventArg<CoreEvents[K]>) => void): void
    once<K extends keyof CoreEvents>(event: K, listener: (...args: EventArg<CoreEvents[K]>) => void): void
}

export default abstract class Core {
    private static _mainWindow: BrowserWindow
    private static _status: boolean
    public static readonly events = new EventEmitter() as CoreEmitter

    static get mainWindow() {
        return this._mainWindow
    }

    static set mainWindow(win: BrowserWindow) {
        this._mainWindow = win
        SettingsAccessor.mainWindow = win
    }

    static get settings(): Readonly<Settings> {
        return {...settings}
    }

    static get strategiesPaths(): path[] {
        return Core.strategiesNames.map((val, i) => pr(paths.coreDir, val))
    }

    static get strategiesNames(): string[] {
        let strategiesName = fs.readdirSync(paths.coreDir)
        strategiesName = strategiesName.filter((val, i, arr) => arr[i].endsWith('.bat') && !arr[i].startsWith('service'))
        return strategiesName
    }
    static checkService = () => SCController.checkService()
    static setStrategy(strategy: string | null) {
        console.log(`Core.setStrategy(${strategy})`)
        if (strategy === null) {
            SCController.delete()
            settings.status = false
            this.events.emit('strategyChanged', null)
            return
        }
        if (!strategy || typeof strategy !== 'string') throw new CoreError('Wrong strategy!')
        let begin = Date.now()

        const strategyPath = pr(paths.coreDir, strategy)
        if (!fs.existsSync(strategyPath)) throw new CoreError(`Invalid strategy ${strategy}`)
        const strategyFile = fs.readFileSync(strategyPath).toString()
        const parsedStrategy = strategyParser(strategyFile, settings.gameFilter)
        const res = SCController.start(parsedStrategy, strategy, settings.gameFilter)
        if (res) {
            settings.selectedStrategy = strategy
            settings.status = true
            this.events.emit('strategyChanged', strategy)
        }
        let end = Date.now() 
        console.log((end - begin) / 1000, 's')
        return(res)
    }
    static setGameFilter(value: boolean) {
        if (typeof value !== 'boolean') throw new CoreError(`Wrong gameFilter value: ${value}`)
        if (settings.gameFilter == value) {
            console.warn('Skipping gameFilter')
            return
        }
        const strategyName = settings.selectedStrategy
        const strategyPath = pr(paths.coreDir, strategyName)
        const strategyFile = fs.readFileSync(strategyPath).toString()
        const parsedStrategy = strategyParser(strategyFile, value)
        SCController.delete()
        const res = SCController.start(parsedStrategy, settings.selectedStrategy, value)
        if (res) {
            settings.gameFilter = value
            settings.status = true
            this.events.emit('gameFilterChanged', value)
        }
        return res
    }

    static openCoreFolder() {
        shell.showItemInFolder(paths.coreDir);
    }

    static setAutoUpdate(autoUpdate: boolean) {
        settings.autoUpdate = autoUpdate
    }

    static setNotifications(notifications: boolean) {
        settings.notifications = notifications
    }
    static setAutoLoad(autoLoad: boolean) {
        settings.autoLoad = autoLoad
    }
}

class CoreError extends Error {
    constructor(message: any) {
        super(message);          // Передаём сообщение в базовый Error
        this.name = this.constructor.name; // Имя класса как имя ошибки
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor); // Корректный стек
        }
    }
}
