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
 * Represents JSON-like data of `Filter`.
 */
export interface IFilterData {
    name:       string
    type:       FilterType
    pathConfig: string
    pathTxt:    string
    config:     IFilterConfig
}

/**
 * Represents all public methods of `Filter`.
 */
export interface IFilterMethods {
    /** Get formatted data to send through IPC */   toJSON: () => IFilterData
    /** Edit config in `.gfilter` file */           editConfig: (value: IFilterConfig) => boolean
    /** Restore config from `backup/lists` */       restoreConfig: () => boolean
    /** Write data from `config` to `lists/` dir*/  write: () => boolean
}

/**
 * Represents `Filter` class with all its methods and properties. 
 */
export interface IFilter extends IFilterData, IFilterMethods {}

/**
 * Represent basic `Filter` entity. It's able to:
 * * Read data from `.gfilter` and write it in `config` property
 * * Write data from `config` to `lists/` dir
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
    protected _config!: IFilterConfig
    public get config(): IFilterConfig {
        return this._config
    }
    protected set config(value: IFilterConfig) {
        this._config = value
    }
    static readonly РРёРРРёСРµСЂРёРЅРіСРѕРЅ = void (NaN**-NaN)

    protected constructor (type: FilterType, name: string) {
        this.type = type
        this.name = name
        this.pathConfig = pr(userDataPath, `${type}-${name}.gfilter`)
        this.pathTxt = pr(coreDir, 'lists', `${type}-${name}.txt`)
        this.fileName = `${type}-${name}.txt`
    }
    public static Create(type: FilterType, name: string): Filter {
        let res = new Filter(type, name)
        res.initStatic()
        res._config = JSON.parse(fs.readFileSync(res.pathConfig).toString())
        return res
    }
    protected initStatic(): void {
        if (!fs.existsSync(this.pathConfig)) {
            this.restoreConfig()
        }
    }
    public editConfig(value: Partial<IFilterConfig>): boolean {
        try {
            this.config = {
                ...this.config,
                ...value
            }
            fs.writeFileSync(this.pathConfig, JSON.stringify(this.config))
            this.write()
            return true
        } catch (e: any) {
            console.error(e)
            return false
        }
    }
    public restoreConfig(): boolean {
        try {
            const backup = fs.readFileSync(pr(coreDir, `backup/lists/${this.type}-${this.name}.txt`)).toString().split('\n')
            fs.writeFileSync(this.pathConfig, JSON.stringify({
                list: backup
            }))
            this.write()
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
    public write() {
        try {
            fs.writeFileSync(this.pathTxt, this.config.list.join('\n'))
            return true
        } catch (error) {
            console.error(error)
            return false
        }
    }
}
