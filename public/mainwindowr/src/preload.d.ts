import { ConnectionCheckerResult } from '../../../modules/Core/ConnectionChecker.ts'
import { Settings } from '../../../modules/Core/Settings.ts'
import { IpcRendererEvent } from 'electron'
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
    settingsChanged: (cb: (settings: Settings) => any) => Promise<Settings>
    cleanSettingsChanged: () => void
    getStrategiesNames: () => string[]
    setStrategy: (strategy: string) => Promise<boolean>
    setGameFilter: (value: boolean) => Promise<boolean>
    openCoreFolder: () => Promise<true>
    setAutoUpdate: (autoUpdate: boolean) => Promise<void>
    setNotifications: (notifications: boolean) => Promise<void>
    setAutoLoad: (autoLoad: boolean) => Promise<void>
    connectionChecker: () => Promise<ConnectionCheckerResult>
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