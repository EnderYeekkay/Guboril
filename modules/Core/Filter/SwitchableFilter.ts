import { app } from 'electron'
import fs from 'fs'
import { resolve as pr } from 'path'
import { coreDir } from '../paths.ts'


import { Filter, IFilterConfig, FilterType, IFilterData, IFilter } from "./Filter.ts";

interface ISwitchableFilterConfig<T extends string> extends IFilterConfig {
    mode: T
}
interface ISwitchableFilterData<T extends string> extends IFilterData {
    config: ISwitchableFilterConfig<T>
}
export class SwitchableFilter<T extends string> extends Filter implements IFilter {
    public readonly onFilterChange: (newMode: T, oldMode: T, filter: SwitchableFilter<T>) => void
    declare public config: ISwitchableFilterConfig<T>
    // Допилить!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // Допилить!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // Допилить!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    #mode: T
    // Допилить!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // Допилить!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // Допилить!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    get mode() {
        return this.#mode
    }
    set mode(newMode: T) {
        this.onFilterChange
        this.#mode = newMode
    }
    constructor(type: FilterType, name: string, onFilterChange: (newMode: T, oldMode: T, filter: SwitchableFilter<T>) => void) {
        super(type, name)
        this.onFilterChange = onFilterChange
        this.config = JSON.parse(fs.readFileSync(this.pathConfig).toString())
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
    public toJSON(): Readonly<ISwitchableFilterData<T>> {
        return {
            name: this.name,
            type: this.type,
            pathConfig: this.pathConfig,
            pathTxt: this.pathTxt,
            config: this.config,
        }
    }
}
