import { ipcMain, nativeImage, BrowserWindow, Tray, Menu, app } from 'electron'
import type { MenuItemConstructorOptions } from 'electron/main'
import path from 'path'
const pr = path.resolve
import Core from './Core/Core.ts'
import { sendServiceOffNotify, sendServiceOnNotify } from './myNotifcations.ts'
let initialized = false
export async function initializeTray(win: BrowserWindow, publicPath: string) {
    if (initialized) throw new Error('Attempt reinitialize tray has been detected!')
    initialized = true

    const icon_resize_option: Electron.ResizeOptions = { width: 16, height: 16 }
    const image_path = path.resolve(publicPath, 'mainwindowr')
    const tray_on_img = nativeImage.createFromPath(pr(image_path, 'tray_on.png')).resize(icon_resize_option)
    const tray_off_img = nativeImage.createFromPath(pr(image_path, 'tray_off.png')).resize(icon_resize_option)
    const guboril_img = nativeImage.createFromPath(pr(image_path, 'icon.ico')).resize(icon_resize_option)
    const maximize_img = nativeImage.createFromPath(pr(image_path,'maximize.png')).resize(icon_resize_option)
    const exit_img = nativeImage.createFromPath(pr(image_path,'exit.png')).resize(icon_resize_option)
    const launch_img = nativeImage.createFromPath(pr(image_path,'power.png')).resize(icon_resize_option)
    const power_off_text = 'Остановить ядро'
    const power_on_text = 'Запустить ядро'
    const tray = new Tray(Core.settings.status ? tray_on_img : tray_off_img)

    tray.on('double-click', (event, bounds) => {
        console.log('double-click on tray')
        win.show()
    })
    function generate_power_btn_menuItem ():MenuItemConstructorOptions {
        return {
            label: Core.settings.status ? power_off_text : power_on_text,
            icon: launch_img,
            click: async (menuItem) => {
                menuItem.enabled = false

                if (Core.settings.status) {
                    Core.setStrategy(null)
                    if(!win.isVisible()) sendServiceOffNotify()
                } else {
                    Core.setStrategy(Core.settings.selectedStrategy)
                    if(!win.isVisible()) sendServiceOnNotify(Core.settings.selectedStrategy)
                }
                regenerate_tray()
                menuItem.enabled = true
            }
        }
    }

    function buildTrayMenu() {
        tray.setImage(Core.settings.status ? tray_on_img : tray_off_img)
        return Menu.buildFromTemplate([
        { label: `Guboril`, icon: guboril_img, enabled: false},
        { type: 'separator' },
        { label: 'Развернуть', icon: maximize_img, click: () => win.show() },
        generate_power_btn_menuItem(),
        { type: 'separator' },
        { label: 'Выход из Guboril', click: () => app.quit(), icon: exit_img}
        ])
    }

    function regenerate_tray() {
        tray.closeContextMenu()
        tray.setContextMenu(buildTrayMenu())
    }

    Core.events.on('strategyChanged', regenerate_tray)
    Core.events.on('gameFilterChanged', regenerate_tray)

    tray.setContextMenu(buildTrayMenu())
}