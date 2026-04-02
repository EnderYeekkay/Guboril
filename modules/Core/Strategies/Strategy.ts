import { coreDir } from '../paths.ts'
import { resolve as pr } from 'path'
import strategyParser from './strategyParser.ts'
import { type GameFilterOptions, type parsedStrategy } from './strategyParser.ts'
import type { SpecialString } from '../Core.ts'
export type StrategyFullName = `general${string}.bat`
import fs from 'fs'
export interface IStrategy {
    ino: number
    path: string
    code: string
    fullName: StrategyFullName
    shortName: string
    isLegacy: boolean
}

export default class Strategy implements IStrategy {
    //#region Properties
    public readonly ino: number
    public readonly path: Readonly<string>
    public readonly code: Readonly<string>
    public static readonly regex: RegExp = /^general(.*)\.bat$/

    private readonly _name: StrategyFullName
    /**
     * Something like `general (ALT11).bat`, `general (FAKE TLS AUTO ALT).bat`
     */
    get fullName(): StrategyFullName {
        return this._name
    }
    /**
     * Something like `ALT11`, `FAKE TLS AUTO ALT`
     */
    get shortName(): string {
        if (this._name === 'general.bat') return 'general'
        return this._name.match(Strategy.regex)![1].replace('(', '').replace(')', '')
    }

    private readonly _legacy: boolean
    get isLegacy(): boolean {
        return this._legacy
    }

    //#region Constructor
    private constructor (name: StrategyFullName, code: string) {
        this._name = name
        this.code = code
        this._legacy = code.includes('%GameFilter%') ? true : false
        this.path = pr(coreDir, name)
        this.ino = fs.statSync(pr(coreDir, name)).ino
    }
    //#endregion

    //#region Methods
    toJSON(): IStrategy {
        return {
            ino: this.ino,
            path: this.path,
            code: this.code,
            fullName: this.fullName,
            shortName: this.shortName,
            isLegacy: this._legacy
        }
    }
    /**
     * If recieve wrong params, function will returns `null` 
     */
    static from(name: StrategyFullName, code: string): Strategy {
        if (!name.match(Strategy.regex)) console.warn(`Wrong strategy name has given: ${name}`)
        if (code.length < 10) console.warn(`Wrong code has given:\n${code}`)
        return new Strategy(name, code)
    }
    parse(gameFilterOptions: GameFilterOptions): SpecialString<parsedStrategy> {
        return strategyParser(this.code, gameFilterOptions)
    }
    //#endregion
}