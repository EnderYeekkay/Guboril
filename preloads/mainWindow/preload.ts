import { contextBridge, ipcRenderer } from 'electron';

import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import pkg from '../../package.json' with { type: 'json' };
import type { GameFilterOptions } from '../../modules/Core/Strategies/strategyParser.ts';
import type { IFilter, IFilterConfig, IFilterData, IFilterMethods } from '../../modules/Core/Filter/Filter.ts';
import type { IpsetAllType } from '../../modules/Core/Filter/FilterManager.ts';
import type FilterManager from '../../modules/Core/Filter/FilterManager.ts';
import type { ISwitchableFilterConfig, ISwitchableFilterData, ISwitchableFilterMethods } from '../../modules/Core/Filter/SwitchableFilter.ts';
import type { ClassMethods, ReturnTypeOfMethod } from '../../modules/Core/HandlersRegistrator.ts';
import ConnectionChecker from '../../modules/Core/ConnectionCheker/ConnectionChecker.ts';
import Fake from '../../modules/Core/Fakes/Fake.ts';
import type { ISystemEvent } from '../../modules/Core/SCEventLogFacade.ts';

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
  externalUrl: (url: string) => ipcRenderer.send('externalUrl', url),
  save_logs: () => ipcRenderer.send('save_logs'),
  clear_discord_cache: () => ipcRenderer.invoke('clear_discord_cache')
})

export class FilterAPI implements IFilterMethods {
  toJSON: () => IFilterData;
  editConfig: (value: IFilterConfig) => boolean;
  restoreConfig: () => boolean;
  write: () => boolean;
  public constructor(filterName: keyof typeof FilterManager) {
    this.toJSON = () => ipcRenderer.sendSync('filter:interaction', filterName, 'toJSON')
    this.editConfig = (value) => ipcRenderer.sendSync('filter:interaction', filterName, 'editConfig', value)
    this.restoreConfig = () => ipcRenderer.sendSync('filter:interaction', filterName, 'restoreConfig')
    this.write = () => ipcRenderer.sendSync('filter:interaction', filterName, 'write')
  }
}
export class SwitchableFilterAPI<T extends string> extends FilterAPI implements ISwitchableFilterMethods<T> {
  setMode: (newMode: T) => void
  toJSONSwitchable: () => ISwitchableFilterData<T>
  public constructor(filterName: keyof typeof FilterManager) {
    super(filterName)
    this.toJSONSwitchable = this.toJSON as () => ISwitchableFilterData<T>
    this.setMode = (newMode) => ipcRenderer.sendSync('filter:interaction', filterName, 'setMode', newMode)
  }
}
export const FilterManagerRenderer = {
  IpsetAll: new SwitchableFilterAPI<IpsetAllType>('IpsetAll'),
  IpsetExclude: new FilterAPI('IpsetExclude'),
  ListGeneral: new FilterAPI('ListGeneral'),
  ListExclude: new FilterAPI('ListExclude')
}
export type FilterManagerRendererType = typeof FilterManagerRenderer

export const ConnectionCheckerRenderer: ClassMethods<typeof ConnectionChecker> = {
  calcExpiringTime: () => ipcRenderer.invoke('ConnectionChecker:calcExpiringTime') as ReturnTypeOfMethod<typeof ConnectionChecker, "calcExpiringTime">,
  check: () => ipcRenderer.invoke('ConnectionChecker:check') as ReturnTypeOfMethod<typeof ConnectionChecker, "check">,
  checkInternet: () => ipcRenderer.invoke('ConnectionChecker:checkInternet') as ReturnTypeOfMethod<typeof ConnectionChecker, "checkInternet">,
  checkUrl: (url, options) => ipcRenderer.invoke('ConnectionChecker:checkUrl', url, options) as ReturnTypeOfMethod<typeof ConnectionChecker, "checkUrl">
}
export type ConnectionCheckerRendererType = typeof ConnectionCheckerRenderer

contextBridge.exposeInMainWorld('core', {
  getSettings: () => ipcRenderer.sendSync('core:getSettings'),
  settingsChanged: (cb) => ipcRenderer.on('core:settingsChanged', (_, settings) => cb(settings)),
  strategyChanged: (cb) => ipcRenderer.on('core:strategyChanged', (_, strategy) => cb(strategy)),
  strategiesCacheChanged: (cb) => ipcRenderer.on('core:strategiesCacheChanged', (_, strategies) => cb(strategies)),
  cleanCoreEventsHandlers: () => {
    ipcRenderer.removeAllListeners('core:settingsChanged')
    ipcRenderer.removeAllListeners('core:strategyChanged')
    ipcRenderer.removeAllListeners('core:strategiesCacheChanged')
  },
  getStrategies: () => ipcRenderer.sendSync('core:getStrategies'),
  setStrategy: (strategy: string) => ipcRenderer.invoke('core:setStrategy', strategy),
  setGameFilter: (value: GameFilterOptions) => ipcRenderer.invoke('core:setGameFilter', value),
  openCoreFolder: () => ipcRenderer.send('core:openCoreFolder'),
  openAppData: () => ipcRenderer.send('core:openAppData'),  
  checkService: () => ipcRenderer.sendSync('core:checkService'),
  setAutoUpdate: (autoUpdate: boolean) => ipcRenderer.send('core:setAutoUpdate', autoUpdate),
  setNotifications: (notifications: boolean) => ipcRenderer.send('core:setNotifications', notifications),
  setAutoLoad: (autoLoad: boolean) => ipcRenderer.send('core:setAutoLoad', autoLoad),
  connectionChecker: () => ipcRenderer.invoke('core:connectionChecker'),
  coreUpdater: () => ipcRenderer.invoke('core:coreUpdater'),
  restoreStrategies: () => ipcRenderer.invoke('core:restoreStrategies'),
  editStrategy: (strategy) => ipcRenderer.send('core:editStrategy', strategy),
  FilterManagerRenderer: FilterManagerRenderer,
})

const SCEventLogFacade = {
  SystemEvent: (cb: (event: ISystemEvent) => void) => ipcRenderer.on('SCEventLogFacade:SystemEvent', (_, event: ISystemEvent) => cb(event)),
  clearEvets: () => {
    ipcRenderer.removeAllListeners('SCEventLogFacade:SystemEvent')
  }
}
export type SCEventLogFacadeType = typeof SCEventLogFacade
contextBridge.exposeInMainWorld('SCEventLogFacade', SCEventLogFacade)

contextBridge.exposeInMainWorld('logger', {
  log: (...args: any[]) => ipcRenderer.send('renderer-log', 'log', ...args),
  warn: (...args: any[]) => ipcRenderer.send('renderer-log', 'warn', ...args),
  error: (...args: any[]) => ipcRenderer.send('renderer-log', 'error', ...args),
})

contextBridge.exposeInMainWorld('scheduler_api', {
  createTask: () => ipcRenderer.invoke('scheduler:createTask'),
  deleteTask: () => ipcRenderer.invoke('scheduler:deleteTask'),
  checkTask: () => ipcRenderer.invoke('scheduler:checkTask'),
})

contextBridge.exposeInMainWorld('ConnectionChecker', ConnectionCheckerRenderer)

export const FakeRenderer = {
  All: () => ipcRenderer.sendSync('FakeManager:All') as Fake[],
  withName: (value: string) => ipcRenderer.sendSync('FakeManager:withName', value) as Fake,
  restoreFakeDiscordUDP: () => ipcRenderer.sendSync('FakeManager:restoreFakeDiscordUDP') as Fake,
  changeFakeDiscordUDP: (value: string) => ipcRenderer.sendSync('FakeManager:changeFakeDiscordUDP', value) as void,
  getFakeDiscordUDP: () => ipcRenderer.sendSync('FakeManager:getFakeDiscordUDP') as Fake,
  restoreFakeGameFilterUDP: () => ipcRenderer.sendSync('FakeManager:restoreFakeGameFilterUDP') as Fake,
  changeFakeGameFilterUDP: (value: string) => ipcRenderer.sendSync('FakeManager:changeFakeGameFilterUDP', value) as void,
  getFakeGameFilterUDP: () => ipcRenderer.sendSync('FakeManager:getFakeGameFilterUDP') as Fake,
}

export type FakeRendererType = typeof FakeRenderer
contextBridge.exposeInMainWorld('FakeRenderer', FakeRenderer)
