import { ConnectionCheckerResult } from '../../../modules/Core/сonnectionChecker.ts'
import { Settings } from '../../../modules/Core/Settings.ts'
import { IpcRendererEvent } from 'electron'
import type { GameFilterOptions } from '../../../modules/Core/Strategies/strategyParser.ts'
import type { updateStrategiesResult } from '../../../modules/Core/CoreUpdater.ts'
import type { IStrategy } from '../../../modules/Core/Strategies/Strategy.ts'
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

//   const zapret: {
//     isInstalled: () => Promise<boolean>
//     checkStatus: () => Promise<[boolean]>
//     remove: () => Promise<[boolean]>
//     install: (strategy: string) => Promise<[boolean]>
//     switchGameFilter: () => Promise<true>
//     getData: () => Promise<ZapretData>
//     getAllStrategies: () => Promise<string[]>

//     fetchLatestVersion: () => Promise<{tag: string, url: string}>
//     updateZapret: () => Promise<0 | 1>
//     uninstallCore: () => Promise<any | boolean>

//     getSettings: () => Promise<Settings>
//     setSettings: (data: Partial<Settings>) => Promise<true>
//     settingsChanged: (cb: (settings: Settings) => any) => Promise<Settings>
//     openCoreFolder: () => Promise<true>
    
//   }
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
}

// Эта строка делает файл модулем, что позволяет declare global работать
export {}; 