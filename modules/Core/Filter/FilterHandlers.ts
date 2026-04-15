import { app, ipcMain, shell } from "electron";

import FilterManager, { type IpsetAllType } from "./FilterManager.ts";
import type { ISwitchableFilterConfig, ISwitchableFilterData, ISwitchableFilterMethods, SwitchableFilter } from "./SwitchableFilter.ts";
import { type IFilter, Filter } from "./Filter.ts";

export default function initFilterHandlers() {
    ipcMain.on('filter:interaction', (
        event,
        filterName: keyof typeof FilterManager,
        actionName: keyof ISwitchableFilterMethods<IpsetAllType>,
        ...args: any[]
    ): any => {
        const filter = FilterManager[filterName] as Filter
        if (!filter) throw new Error(`Filter ${filterName} doesn\'t exist!`)

        const action = filter[actionName as keyof IFilter] as (...args: any[]) => any
        if (!action) throw new Error(`Method ${actionName} doesn\'t exist in ${filterName}!`)

        if (action instanceof Function) {
            event.returnValue = action.call(filter, ...args)
        } else throw new Error(`${filterName}.${actionName} is not a function!`)
    })

}
