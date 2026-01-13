import { ZapretData, Settings } from '../../../modules/Zapret.ts'
import { IpcRendererEvent } from 'electron'
declare global {
  const mw: { 
    version: string
    closeWindow: () => void
    minimize: () => void
    uwu: () => void
    open_github: () => void
    save_logs: () => void
    clear_discord_cache: () => Promise<boolean>
  }

  const zapret: {
    isInstalled: () => Promise<boolean>
    checkStatus: () => Promise<[boolean]>
    remove: () => Promise<[boolean]>
    install: (strategy: string) => Promise<[boolean]>
    switchGameFilter: () => Promise<true>
    getData: () => Promise<ZapretData>
    getAllStrategies: () => Promise<string[]>

    getLatestVersion: () => Promise<{tag: string, url: string}>
    fetchLatestVersion: () => Promise<{tag: string, url: string}>
    updateZapret: () => Promise<0 | 1>
    uninstallCore: () => Promise<any | boolean>

    getSettings: () => Promise<Settings>
    setSettings: (data: Partial<Settings>) => Promise<true>
    settingsChanged: (cb: (settings: Settings) => any) => Promise<Settings>
    openCoreFolder: () => Promise<true>
    
  }
  
  const tray_event: {
    // Используем инлайн-импорт типа
    onDisableToStop: (cb: (event: IpcRendererEvent) => void) => void
    onRollbackToStop: (cb: (event: IpcRendererEvent) => void) => void
    sendDisableToStop: () => void
    sendRollbackToStop: () => void
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
