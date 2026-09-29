import { ConnectionCheckerResult } from '../../../modules/Core/ConnectionCheker/сonnectionChecker.ts'
import { Settings } from '../../../modules/Core/Settings.ts'
import { IpcRendererEvent } from 'electron'
import type { GameFilterOptions } from '../../../modules/Core/Strategies/strategyParser.ts'
import type { updateStrategiesResult } from '../../../modules/Core/CoreUpdater.ts'
import type { IStrategy } from '../../../modules/Core/Strategies/Strategy.ts'
import type { ISwitchableFilterData, ISwitchableFilterMethods } from '../../../modules/Core/Filter/SwitchableFilter.ts'
import type { IpsetAllType } from '../../../modules/Core/Filter/FilterManager.ts'
import type { IFilterData, IFilterMethods } from '../../../modules/Core/Filter/Filter.ts'
import type { ConnectionCheckerRendererType, FakeRendererType, FilterManagerRenderer } from '../../../preloads/mainWindow/preload.ts'
import type { FilterManagerRendererType } from '../../../preloads/mainWindow/preload.ts'
declare global {
  const mw: { 
    version: string
    closeWindow: () => void
    minimize: () => void
    uwu: () => void
    open_github: () => void
    externalUrl: (url: string) => void,
    save_logs: () => void
    clear_discord_cache: () => Promise<boolean>
  }

  const core: {
    getSettings: () => Readonly<Settings>
    checkService: () => boolean
    settingsChanged: (cb: (settings: Settings) => void) => void
    strategyChanged: (cb: (strategy: IStrategy, strategies: IStrategy[]) => void) => void
    strategiesCacheChanged: (cb: (strategies: IStrategy[]) => void) => void
    cleanCoreEventsHandlers: () => void
    getStrategies: () => IStrategy[]
    setStrategy: (strategy: number | null) => boolean
    setGameFilter: (value: GameFilterOptions) => boolean
    openCoreFolder: () => Promise<true>
    openAppData: () => Promise<void>
    setAutoUpdate: (autoUpdate: boolean) => Promise<void>
    setNotifications: (notifications: boolean) => Promise<void>
    setAutoLoad: (autoLoad: boolean) => Promise<void>
    connectionChecker: () => Promise<ConnectionCheckerResult>
    coreUpdater: () => Promise<updateStrategiesResult[]>
    restoreStrategies: () => Promise<0 | 1 | 2>
    editStrategy: (strategy: IStrategy) => Promise<void>
    FilterManagerRenderer: typeof FilterManagerRenderer
  }

  const logger: {
    log: (...args: any[]) => void
    warn: (...args: any[]) => void
    error: (...args: any[]) => void
  }

  const scheduler_api: {
    createTask: () => Promise<any>
    deleteTask: () => Promise<any>
    checkTask: () => Promise<boolean>
  }
  const ConnectionChecker: ConnectionCheckerRendererType
  const FakeRenderer: FakeRendererType
}

export {}; 
