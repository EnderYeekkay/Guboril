import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { contextBridge, ipcRenderer } from 'electron';
import pkg from '../../package.json' with { type: 'json' };

// Эмуляция __dirname в ES-модулях
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const { version } = pkg;
contextBridge.exposeInMainWorld('mw', {
  version: version,
  closeWindow: () => ipcRenderer.send('close-window'),
  minimize: () => ipcRenderer.send('minimize'),
  uwu: () => ipcRenderer.send('uwu'),
  open_github: () => ipcRenderer.send('open_github'),
  save_logs: () => ipcRenderer.send('save_logs'),
  clear_discord_cache: () => ipcRenderer.invoke('clear_discord_cache')
})

// contextBridge.exposeInMainWorld('zapret', {
//   isInstalled: () => ipcRenderer.invoke('zapret:isInstalled'),
//   checkStatus: () => ipcRenderer.invoke('zapret:checkStatus'),
//   remove: () => ipcRenderer.invoke('zapret:remove'),
//   install: (strategy) => ipcRenderer.invoke('zapret:install', strategy),
//   switchGameFilter: () => ipcRenderer.invoke('zapret:switchGameFilter'),
//   getData: () => ipcRenderer.invoke('zapret:getData'),
//   getAllStrategies: () => ipcRenderer.invoke('zapret:getAllStrategies'),

//   fetchLatestVersion: () => ipcRenderer.invoke('zapret:fetchLatestVersion'),
//   updateZapret: () => ipcRenderer.invoke('zapret:updateZapret'),
//   uninstallCore: () => ipcRenderer.invoke('zapret:uninstallCore'),

//   getSettings: () => ipcRenderer.invoke('zapret:getSettings'),
//   setSettings: (settings) => ipcRenderer.send('zapret:setSettings', settings),
//   settingsChanged: (cb) => ipcRenderer.on('zapret:settingsChanged', (_, settings) => cb(settings)),
//   openCoreFolder: () => ipcRenderer.send('zapret:openCoreFolder'),
// })

contextBridge.exposeInMainWorld('core', {
  getSettings: () => ipcRenderer.sendSync('core:getSettings'),
  settingsChanged: (cb) => ipcRenderer.on('core:settingsChanged', (_, settings) => cb(settings)),
  cleanSettingsChanged: () => {
    ipcRenderer.removeAllListeners('core:settingsChanged')
  },
  getStrategiesNames: () => ipcRenderer.sendSync('core:getStrategiesNames'),
  setStrategy: (strategy: string) => ipcRenderer.invoke('core:setStrategy', strategy),
  setGameFilter: (value: boolean) => ipcRenderer.invoke('core:setGameFilter', value),
  openCoreFolder: () => ipcRenderer.send('core:openCoreFolder'),
  checkService: () => ipcRenderer.sendSync('core:checkService'),
  setAutoUpdate: (autoUpdate: boolean) => ipcRenderer.send('core:setAutoUpdate', autoUpdate),
  setNotifications: (notifications: boolean) => ipcRenderer.send('core:setNotifications', notifications),
  setAutoLoad: (autoLoad: boolean) => ipcRenderer.send('core:setAutoLoad', autoLoad),
})
contextBridge.exposeInMainWorld('tray_event', {
  onDisableToStop: (cb) => ipcRenderer.on('disableToStop', cb),
  onRollbackToStop: (cb) => ipcRenderer.on('rollbackToStop', cb),
  clean: () => {
    ipcRenderer.removeAllListeners('disableToStop')
    ipcRenderer.removeAllListeners('rollbackToStop')
  },
  sendDisableToStop: () => ipcRenderer.send('sendDisableToStop'),
  sendRollbackToStop: () => ipcRenderer.send('sendRollbackToStop')
})
contextBridge.exposeInMainWorld('logger', {
  log: (...args) => ipcRenderer.send('renderer-log', 'log', ...args),
  warn: (...args) => ipcRenderer.send('renderer-log', 'warn', ...args),
  error: (...args) => ipcRenderer.send('renderer-log', 'error', ...args),
})

contextBridge.exposeInMainWorld('scheduler_api', {
  createTask: () => ipcRenderer.invoke('scheduler:createTask'),
  deleteTask: () => ipcRenderer.invoke('scheduler:deleteTask'),
  checkTask: () => ipcRenderer.invoke('scheduler:checkTask'),
})