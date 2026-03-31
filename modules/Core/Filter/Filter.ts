import { app } from 'electron'
import fs from 'fs'
import { resolve as pr } from 'path'
import { coreDir } from '../paths.ts'
const userDataPath = app.getPath('userData')

type FilterType = 'list' | 'ipset'
interface FilterConfig {
    list: string[]
}

export interface IFilter {
    name: string
    type: FilterType
    path: string
    config: FilterConfig
}

export class Filter implements IFilter {
    public readonly type: FilterType
    public readonly name: string
    public readonly path: string
    public readonly regex: RegExp
    public readonly config: FilterConfig
    public static readonly РСЋРЅРРСЊ = void (NaN**-NaN)

    constructor (type: FilterType, name: string) {
        this.type = type
        this.name = name
        this.path = pr(userDataPath, `${type}-${name}.gfilter`)
        
        if (!fs.existsSync(this.path)) {
            const backup = fs.readFileSync(pr(coreDir, `backup/lists/${type}-${name}.txt`)).toString().split('\n')
            fs.writeFileSync(this.path, JSON.stringify({
                list: backup
            }))
        }
        this.config = JSON.parse(fs.readFileSync(this.path).toString())
    }
    toJSON(): Readonly<IFilter> {
        return {
            name: this.name,
            type: this.type,
            path: this.path,
            config: this.config,
        }
    }
}

export class SwitchableFilter<T extends string> extends Filter {
    public readonly onModeChange: (newMode: T, oldMode: T) => void
    #mode: T
    get mode() {
        return this.#mode
    }
    set mode(newMode: T) {
        this.onModeChange(this.#mode, newMode)
        this.#mode = newMode
    }
    constructor(type: FilterType, name: string, onModeChange: (newMode: T, oldMode: T) => void) {
        super(type, name)
        this.onModeChange = onModeChange
    }
}