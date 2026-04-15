import { app, ipcMain, shell } from "electron";
import { resolve as pr } from 'path'
import Core from "./Core.ts";
import ConnectionChecker from "./сonnectionChecker.ts";
import updateStrategies from "./CoreUpdater.ts";
import { sendServiceOnNotify } from "../tasks/myNotifcations.ts";
import StrategyManager from "./Strategies/StrategyManager.ts";
import restoreStrategies from "./Strategies/restoreStrategies.ts";
import editStrategy from "./Strategies/editStrategy.ts";

export default function initCoreHandlers() {
    ipcMain.on('core:getStrategies', (event) => {
        event.returnValue = Core.strategies;
    })
    ipcMain.on('core:getSettings', (event) => {
        event.returnValue = Core.settings;
    })
    ipcMain.on('core:checkService', (event) => {
        event.returnValue = Core.checkService();
    })
    ipcMain.handle('core:setStrategy', (_, strategy) => {
        const res = Core.setStrategy(strategy)
        if (!Core.mainWindow.isVisible()) sendServiceOnNotify(StrategyManager.withIno(strategy)?.shortName)
        return res
    })
    ipcMain.handle('core:setGameFilter', (_, value) => Core.setGameFilter(value))
    ipcMain.on('core:openCoreFolder', () => Core.openCoreFolder())
    ipcMain.on('core:openAppData', () => shell.openPath(pr(app.getPath('userData'))))

    ipcMain.on('core:setAutoUpdate', (_, autoUpdate) => Core.setAutoUpdate(autoUpdate))
    ipcMain.on('core:setNotifications', (_, notifications) => Core.setNotifications(notifications))
    ipcMain.on('core:setAutoLoad', (_, autoLoad) => Core.setAutoLoad(autoLoad))
    ipcMain.handle('core:connectionChecker', () => ConnectionChecker())
    ipcMain.handle('core:coreUpdater', () => updateStrategies())
    ipcMain.handle('core:restoreStrategies', () => restoreStrategies())
    ipcMain.on('core:editStrategy', (_, strategy) => editStrategy(strategy))

}
