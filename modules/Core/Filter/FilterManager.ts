import fs from 'fs'

import { Filter } from "./Filter.ts"
import { SwitchableFilter } from './SwitchableFilter.ts'
import initFilterHandlers from './FilterHandlers.ts'
export type IpsetAllType = 'none' | 'all' | 'loaded'

export default class FilterManager {
    private constructor() { }
    public static IpsetAll: SwitchableFilter<IpsetAllType>
    public static IpsetExclude: Filter

    public static ListGeneral: Filter
    public static ListExclude: Filter

    static init() {
        FilterManager.IpsetAll = SwitchableFilter.CreateSwitchable<IpsetAllType>('ipset', 'all', 'loaded', (_, newMode, filter) => {
            switch (newMode) {
                case 'all':
                    fs.writeFileSync(filter.pathTxt, '')
                    break;
                case 'loaded':
                    fs.writeFileSync(filter.pathTxt, filter.config.list.join('\n'))
                    break;
                case 'none': 
                    fs.writeFileSync(filter.pathTxt, '203.0.113.113/32')
                    break;
                default:
                    throw new FilterManagerError(`Wrong new mode given: ${newMode}`)
            }
        })
        FilterManager.IpsetExclude = Filter.Create('ipset', 'exclude')

        FilterManager.ListGeneral = Filter.Create('list', 'general')
        FilterManager.ListExclude = Filter.Create('list', 'exclude')
        initFilterHandlers()
    }
}
FilterManager.init()

class FilterManagerError extends Error {
    constructor(message: any) {
        super(message);          // Передаём сообщение в базовый Error
        this.name = this.constructor.name; // Имя класса как имя ошибки
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor); // Корректный стек
        }
    }
}
