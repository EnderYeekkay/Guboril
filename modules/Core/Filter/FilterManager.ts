import fs from 'fs'

import { Filter } from "./Filter.ts"
import { SwitchableFilter } from './SwitchableFilter.ts'

export type IpsetAllType = 'none' | 'all' | 'loaded'

export default class FilterManager {
    private constructor() { }
    public static IpsetAll: SwitchableFilter<IpsetAllType>
    public static IpsetExclude: Filter

    public static ListGeneral: Filter
    public static ListExclude: Filter

    static init() {
        FilterManager.IpsetAll = new SwitchableFilter<IpsetAllType>('ipset', 'all', (newMode, _, filter) => {
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
        FilterManager.IpsetExclude = new Filter('ipset', 'exclude')

        FilterManager.ListGeneral = new Filter('list', 'general')
        FilterManager.ListExclude = new Filter('list', 'exclude')
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
