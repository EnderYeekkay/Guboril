import fs from 'fs'
import { resolve as pr, basename } from 'path'
import Chokidar, { FSWatcher } from 'chokidar'

import { coreDir } from '../paths.ts'
import Strategy, { type StrategyFullName, type IStrategy } from "./Strategy.ts"
import { EventEmitter } from 'node:events'
import ansi from 'ansi-styles'
const { color } = ansi
const debug = true

export default interface StrategyManagerEvents {
    cache_change: [Strategy]
    cache_unlink: never
    cache_add: [Strategy]
}
type EventArg<T> = Extract<T, readonly unknown[]>
type StrategyManagerEmitter = EventEmitter & {
    emit<K extends keyof StrategyManagerEvents>(event: K, ...args: EventArg<StrategyManagerEvents[K]>): boolean
    on<K extends keyof StrategyManagerEvents>(event: K, listener: (...args: EventArg<StrategyManagerEvents[K]>) => void): void
    once<K extends keyof StrategyManagerEvents>(event: K, listener: (...args: EventArg<StrategyManagerEvents[K]>) => void): void
}

export default abstract class StrategyManager {
    public static readonly events = new EventEmitter() as StrategyManagerEmitter
    public static readonly watcher: FSWatcher = Chokidar.watch(coreDir, {
        ignoreInitial: true,
        // ignored: (path, stats) => {
        //     if (stats?.isFile()) return !Strategy.regex.test(basename(path))
        //     return false
        // }
    })
    private static cachedStrategies: Strategy[]

    public static get All(): Readonly<Strategy[]> {
        return this.cachedStrategies
    }
    public static get AllJSON(): Readonly<IStrategy[]> {
        return this.cachedStrategies.map(s => s.toJSON())
    }
    public static init() {
        this.cachedStrategies = fs.readdirSync(coreDir)
        .filter(val => val.match(Strategy.regex))
        .map((val: StrategyFullName) => Strategy.from(val, fs.readFileSync(pr(coreDir, val)).toString()))

        this.watcher.on('change', (path, stats) => {
            const changedStrategyName = basename(path) as StrategyFullName
            if (!changedStrategyName.match(Strategy.regex)) return

            const changedIdx = this.cachedStrategies.findIndex(cachedStrategy => cachedStrategy.fullName === changedStrategyName)
            if (changedIdx !== -1) {
                this.cachedStrategies[changedIdx] = Strategy.from(
                    changedStrategyName,
                    fs.readFileSync(path).toString()
                )
            } else {
                console.warn('Failed to update cached strategy', changedStrategyName)
                return
            }
            console.log(`Handled core dir event: ${color.yellowBright.open} change ${color.yellowBright.close}`)
            this.events.emit('cache_change', this.withName(changedStrategyName))
            logStrategiesList()
        })

        this.watcher.on('unlink', (path, stats) => {
            const deletedStrategyName = basename(path) as StrategyFullName
            if (!deletedStrategyName.match(Strategy.regex)) return

            this.cachedStrategies = this.cachedStrategies.filter(cachedStrategy => cachedStrategy.fullName !== deletedStrategyName)
            this.events.emit('cache_unlink')
            console.log(`Handled core dir event: ${color.yellowBright.open} unlink ${color.yellowBright.close}`)
            logStrategiesList()
        })

        this.watcher.on('add', (path, stats) => {
            const addedStrategyName = basename(path) as StrategyFullName
            if (!addedStrategyName.match(Strategy.regex)) return

            if (!this.cachedStrategies.find(cachedStrategy => cachedStrategy.fullName === addedStrategyName)) {
                this.cachedStrategies.unshift(Strategy.from(addedStrategyName, fs.readFileSync(path).toString()))
            } else {
                console.warn('Strategy with name: ', addedStrategyName, 'already cached!')
            }
            this.events.emit('cache_add', this.withName(addedStrategyName))
            console.log(`Handled core dir event: ${color.yellowBright.open} add ${color.yellowBright.close}`)
            logStrategiesList()
        })
    }
    public static withName(name: StrategyFullName): Strategy | null {
        let res: Strategy = null
        res = this.cachedStrategies.find(strategy => strategy.fullName === name)
        if (res === null) console.warn('No strategy in cache with name:', name)
        return res
    }
    public static withIno(ino: number): Strategy | null {
        let res: Strategy = null
        res = this.cachedStrategies.find(strategy => strategy.ino === ino)
        if (res === null) console.warn('No strategy in cache with ino:', ino)
        return res
    }
}
StrategyManager.init()

function logStrategiesList(): void {
    if (debug) {
        const length1 = Math.max(9, ...StrategyManager.All.map(s => s.fullName.length + 1))
        const length2 = 7
        const length3 = Math.max(5, ...StrategyManager.All.map(s => s.code.length.toString().length + 1))
        const length4 = Math.max(4, ...StrategyManager.All.map(s => s.ino.toString().length + 1))
        const length5 = Math.max(5, ...StrategyManager.All.map(s => s.path.length + 3))
        console.log(
            ansi.bold.open +
            'FullName'.padEnd(length1),
            'Legacy'.padEnd(length2),
            'Size'.padEnd(length3),
            'Ino'.padEnd(length4),
            'Path'.padEnd(length5) +
            ansi.bold.close
        )
        StrategyManager.All.map(strategy => console.log(
            strategy.fullName.padEnd(length1), 
            String(strategy.isLegacy ? ansi.color.blueBright.open + 'true   ' + ansi.color.blueBright.close : 'false').padEnd(length2), 
            strategy.code.length.toString().padEnd(length3),
            strategy.ino.toString().padEnd(length4),
            `<${strategy.path}>`.padEnd(length5)
        ))
    }
}
