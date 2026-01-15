import { ipcMain, nativeImage, BrowserWindow, Tray, Menu, app } from 'electron'
import type { MenuItemConstructorOptions } from 'electron/main'
import path from 'path'
const pr = path.resolve
import Zapret from './Zapret.ts'
import { sendServiceOffNotify, sendServiceOnNotify } from './myNotifcations.ts'
export async function initializeTray(win: BrowserWindow, zapret: Zapret, publicPath: string) {
    const icon_resize_option: Electron.ResizeOptions = { width: 16, height: 16 }
    const image_path = path.resolve(publicPath, 'images')
    const tray_on_img = nativeImage.createFromPath(pr(image_path, 'tray_on.png')).resize(icon_resize_option)
    const tray_off_img = nativeImage.createFromPath(pr(image_path, 'tray_off.png')).resize(icon_resize_option)
    const guboril_img = nativeImage.createFromPath(pr(image_path, '../icon.ico')).resize(icon_resize_option)
    const maximize_img = nativeImage.createFromPath(pr(image_path,'maximize.png')).resize(icon_resize_option)
    const exit_img = nativeImage.createFromPath(pr(image_path,'exit.png')).resize(icon_resize_option)
    const launch_img = nativeImage.createFromPath(pr(image_path,'power.png')).resize(icon_resize_option)
    let zapretStatus: boolean = (await zapret.checkStatus())[0]
    const power_off_text = 'Остановить ядро'
    const power_on_text = 'Запустить ядро'
    const tray = new Tray(zapretStatus ? tray_on_img : tray_off_img)
    let busy = false

    tray.on('double-click', (event, bounds) => {
        console.log('double-click on tray')
        win.show()
    })
    function regenerate_tray() {
        tray.closeContextMenu()
        tray.setContextMenu(buildTrayMenu())
    }
    function generate_power_btn_menuItem ():MenuItemConstructorOptions {
        return {
            label: zapretStatus ? power_off_text : power_on_text,
            icon: launch_img,
            enabled: !busy,
            click: async (menuItem) => {
                busy = true
                win.webContents.send('disableToStop')
                zapretStatus = (await zapret.checkStatus())[0]
                menuItem.enabled = false

                if (zapretStatus) {
                    await zapret.remove()
                    zapretStatus = false
                    if(!win.isVisible()) sendServiceOffNotify()
                } else {
                    let selectedStrategyNum = Zapret.getSettings().selectedStrategyNum
                    await zapret.install(selectedStrategyNum)
                    zapretStatus = true
                    if(!win.isVisible()) sendServiceOnNotify(selectedStrategyNum)
                }
                busy = false
                regenerate_tray()
                menuItem.enabled = true
                win.webContents.send('rollbackToStop', zapretStatus)
            }
        }
    }
    function buildTrayMenu() {
        tray.setImage(zapretStatus ? tray_on_img : tray_off_img)
        return Menu.buildFromTemplate([
        { label: `Guboril`, icon: guboril_img, enabled: false},
        { type: 'separator' },
        { label: 'Развернуть', icon: maximize_img, click: () => win.show() },
        generate_power_btn_menuItem(),
        { type: 'separator' },
        { label: 'Выход из Guboril', click: () => app.quit(), icon: exit_img}
        ])
    }


    ipcMain.on('sendDisableToStop', () => {
        busy = true
        regenerate_tray()
    })
    ipcMain.on('sendRollbackToStop', async () => {
        zapretStatus = (await zapret.checkStatus())[0]
        busy = false
        regenerate_tray()
    })

    tray.setContextMenu(buildTrayMenu())
}