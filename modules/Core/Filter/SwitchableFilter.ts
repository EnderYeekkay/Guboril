import { app } from 'electron'
import fs from 'fs'
import { resolve as pr } from 'path'
import { coreDir } from '../paths.ts'


import { Filter } from "./Filter.ts";
import type {  IFilterConfig, FilterType, IFilterData, IFilter } from "./Filter.ts";
import ansiStyles from 'ansi-styles';

interface ISwitchableFilterConfig<T extends string> extends IFilterConfig {
    mode: T
}
interface ISwitchableFilterData<T extends string> extends IFilterData {
    config: ISwitchableFilterConfig<T>
}
export class SwitchableFilter<T extends string> extends Filter implements IFilter {
    public readonly onFilterChange: (newMode: T, oldMode: T, filter: SwitchableFilter<T>) => void
    declare protected _config: ISwitchableFilterConfig<T>
    public get config(): ISwitchableFilterConfig<T> {
        return this._config as ISwitchableFilterConfig<T>
    }
    protected set config(value: ISwitchableFilterConfig<T>) {
        this._config = value
    }
    get mode() {
        return this.config.mode
    }
    private defaultMode: T
    public setMode(newMode: T) {
        this.onFilterChange(this.config.mode, newMode, this)
        this.config.mode = newMode
    }
    protected constructor(type: FilterType, name: string, defaultMode: T, onFilterChange: (newMode: T, oldMode: T, filter: SwitchableFilter<T>) => void) {
        super(type, name)
        this.onFilterChange = onFilterChange
        this.defaultMode = defaultMode
    }
    protected Create(...args: never[]): never {
        throw new Error('Don\'t use this method on class SwitchableFilter, use CreateSwitchable instead.')
    }
    public static CreateSwitchable<T extends string>(type: FilterType, name: string, defaultMode: T, onFilterChange: (newMode: T, oldMode: T, filter: SwitchableFilter<T>) => void): SwitchableFilter<T> {
        let res = new SwitchableFilter(type, name, defaultMode, onFilterChange)
        res.initStatic()
        res._config = JSON.parse(fs.readFileSync(res.pathConfig).toString())
        return res
    }
    protected initStatic(): void {
        if (!fs.existsSync(this.pathConfig)) {
            this.restoreConfig()
        }
        this.config = JSON.parse(fs.readFileSync(this.pathConfig).toString())
    }
    public editConfig(value: Partial<ISwitchableFilterConfig<T>>): boolean {
        return super.editConfig(value)
    }
    public restoreConfig(): boolean {
        try {
            console.log(`${ansiStyles.color.cyanBright.open}Restore config for ${this.fileName}${ansiStyles.color.cyanBright.close}`)
            const backup = fs.readFileSync(pr(coreDir, `backup/lists/${this.type}-${this.name}.txt`)).toString().split('\n')
            fs.writeFileSync(this.pathConfig, JSON.stringify({
                list: backup,
                mode: this.defaultMode
            } as ISwitchableFilterConfig<T>))
            return true
        } catch(e: any) {
            console.error(e.stack)
            return false
        }
    }
    public toJSON(): Readonly<ISwitchableFilterData<T>> {
        return {
            name: this.name,
            type: this.type,
            pathConfig: this.pathConfig,
            pathTxt: this.pathTxt,
            config: this.config,
        }
    }
    public write(): boolean {
        try {
            this.onFilterChange(this.mode, this.mode, this)
            return true
        } catch (error) {
            return false
        }
    }
}
