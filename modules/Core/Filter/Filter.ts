import { app } from 'electron'
import fs from 'fs'
import { resolve as pr } from 'path'
import { coreDir } from '../paths.ts'
const userDataPath = app.getPath('userData')

export type FilterType = 'list' | 'ipset'

/**
 * Represents data format in `.gfilter` file.
 */
export interface IFilterConfig {
    list: string[]
}

/**
 * Represents JSON-like data of Filter.
 */
export interface IFilterData {
    name:       string
    type:       FilterType
    pathConfig: string
    pathTxt:    string
    config:     IFilterConfig
}

/**
 * Represents `Filter` class with all its methods. 
 */
export interface IFilter extends IFilterData {
    /** Get formatted data to send through IPC */ toJSON: () => IFilterData
    /** Restore config from `backup/lists` */     restoreConfig: () => boolean
}

/**
 * Represent basic `Filter` entity. It's able to:
 * * Read data from `.gfilter` and write it in `config` property
 * * Convert its data to `IFilterData` format 
 * * Restore config from `backup/lists`
 */
export class Filter implements IFilter {
    readonly type: FilterType
    readonly name: string
    // readonly regex: RegExp

    readonly fileName:`${string}-${string}.txt`
    readonly pathConfig: string
    readonly pathTxt: string
    config!: IFilterConfig
    static readonly РРёРРРёСРµСЂРёРЅРіСРѕРЅ = void (NaN**-NaN)

    constructor (type: FilterType, name: string) {
        this.type = type
        this.name = name
        this.pathConfig = pr(userDataPath, `${type}-${name}.gfilter`)
        this.pathTxt = pr(coreDir, 'lists', `${type}-${name}.txt`)
        this.fileName = `${type}-${name}.txt`
        
        this.initStatic()
    }

    protected initStatic(): void {
        if (!fs.existsSync(this.pathConfig)) {
            this.restoreConfig()
        }
        this.config = JSON.parse(fs.readFileSync(this.pathConfig).toString())
    }
    public restoreConfig(): boolean {
        try {
            const backup = fs.readFileSync(pr(coreDir, `backup/lists/${this.type}-${this.name}.txt`)).toString().split('\n')
            fs.writeFileSync(this.pathConfig, JSON.stringify({
                list: backup
            }))
            return true
        } catch(e: any) {
            console.error(e.stack)
            return false
        }
    }
    toJSON(): Readonly<IFilterData> {
        return {
            name: this.name,
            type: this.type,
            pathConfig: this.pathConfig,
            pathTxt: this.pathTxt,
            config: this.config,
        }
    }
}
