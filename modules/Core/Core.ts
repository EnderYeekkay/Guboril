import { EventEmitter } from 'node:events'
import { resolve as pr } from 'node:path'
import { BrowserWindow, shell } from 'electron'
import fs from 'fs'
const { log } = console
import ansi from 'ansi-styles'
const { color } = ansi

import * as paths from './paths.ts'
import hexResolve, { type HEX } from '../decor/hexToRGB.ts'
import SCController from './SCController.ts'
import strategyParser, {type GameFilterOptions} from './strategyParser.ts'
import { SettingsAccessor, settings, type Settings } from './Settings.ts'
import StrategyManager from './StrategyManager.ts'
import type { IStrategy, StrategyFullName } from './Strategy.ts'
import type Strategy from './Strategy.ts'

const ansiHex = (hex: HEX) => color.ansi16m(...hexResolve(hex))
/** Absoulte path of some file.*/ type path = string

SCController.enableTimestampsTCP()
export let headerPAT = {}
if (settings.GH_TOKEN) {
    headerPAT = {
        'Authorization': `token ${settings.GH_TOKEN}`,
        'User-Agent': 'Guboril'
    }
}

export type Brand<T, K> = K & {readonly __brand: T}
export type SpecialString<T> = Brand<T, string>

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

    static get strategies(): IStrategy[] {
        return StrategyManager.All.map(val => val.toJSON())
    }
    static checkService = () => SCController.checkService()
    static #setStrategy(strategy: StrategyFullName | null, gameFilter: GameFilterOptions = null) {
        if (gameFilter === null) gameFilter = {
            TCP: false,
            UDP: false,
            legacy: false
        }
        const initSetStrategyString = 
        ansiHex('#8400FF')+
        'Core' +
        color.close +

        '.' +

        ansiHex('#67CCFF') +
        'setStrategy' +
        color.close + 

        '(\"' +
        ansiHex('#ECB664') +
        strategy +
        color.close +
        '\", ' +
        ansiHex('#ECB664') +
        gameFilter +
        color.close +
        ')';
        console.log(initSetStrategyString)
        
        if (strategy === null) {
            SCController.delete()
            settings.status = false
            this.events.emit('strategyChanged', null)
            console.log()
            return
        }
        if (!strategy || typeof strategy !== 'string') throw new CoreError('Wrong strategy!')
        let begin = Date.now()

        const parsedStrategy = StrategyManager.withName(strategy)?.parse(gameFilter)
        if (!parsedStrategy) throw new CoreError(`No strategy with name ${strategy} in cache!`)
        console.log(`  ${color.greenBright.open}>${color.greenBright.close} Starting service...`)
        const res = SCController.start(parsedStrategy, strategy, gameFilter)
        if (res) {
            settings.selectedStrategy = strategy
            settings.gameFilter = gameFilter
            settings.status = true
            this.events.emit('strategyChanged', strategy)
        }
        let end = Date.now()
        console.log((end - begin) / 1000, 's')
        console.log()
        return(res)
    }
    static setStrategy(strategy: StrategyFullName | null) {
        this.mainWindow.webContents.send('core:strategyChanged', StrategyManager.AllJSON)
        return this.#setStrategy(strategy, settings.gameFilter)
    }
    static setGameFilter(value: GameFilterOptions) {
        if (typeof value !== 'object') throw new CoreError(`Wrong gameFilter value: ${value}`)
        return this.#setStrategy(settings.selectedStrategy, value)
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

StrategyManager.events.on('cache_add', (strategy: Strategy) => {
    Core.mainWindow.webContents.send('core:strategiesCacheChanged', StrategyManager.AllJSON)
    if (settings.selectedStrategy === strategy.fullName) {
        Core.setStrategy(strategy.fullName)
    }
})
StrategyManager.events.on('cache_change', (strategy: Strategy) => {
    Core.mainWindow.webContents.send('core:strategiesCacheChanged', StrategyManager.AllJSON)
    if (settings.selectedStrategy === strategy.fullName) {
        Core.setStrategy(strategy.fullName)
    }
})
StrategyManager.events.on('cache_unlink', () => {
    Core.mainWindow.webContents.send('core:strategiesCacheChanged', StrategyManager.AllJSON)
})
