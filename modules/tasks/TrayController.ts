import { BrowserWindow, Tray, Menu, app, nativeImage } from 'electron'
import type { MenuItem, MenuItemConstructorOptions, NativeImage, ResizeOptions } from 'electron'
import path from 'path'
const pr = path.resolve

import Core from '../Core/Core.ts'
import { sendServiceOffNotify, sendServiceOnNotify } from './myNotifcations.ts'
import StrategyManager from '../Core/Strategies/StrategyManager.ts'

export default class TrayController {
    static initialized: boolean = false
    static tray: Tray
    static win: BrowserWindow
    private static icon_resize_option: ResizeOptions
    private static image_path: string

    public static images: {
        tray_on_img: NativeImage,
        tray_off_img: NativeImage,
        guboril_img: NativeImage,
        maximize_img: NativeImage,
        exit_img: NativeImage,
        launch_img: NativeImage,
    } = {} as any

    public static texts = {
        power_off_text: 'Остановить ядро',
        power_on_text: 'Запустить ядро'
    }
    
    /**
     * Button of the tray menu, which control `Core` status.
     * 
     * Used as an element of the `menuTemplate`
     */
    private static toggleItem: MenuItemConstructorOptions

    /**
     * Configuration array of the tray menu. Must be used as a param in `tray.setContextMenu()` method
     */
    private static menuTemplate: MenuItemConstructorOptions[]

    public static regenerate_tray() {
        this.tray.closeContextMenu()
        this.tray.setContextMenu(Menu.buildFromTemplate(this.menuTemplate))
    }

    /**
     * 
     * @param win MainWindow reference
     * @param publicPath Absolute path to `public/` folder
     */
    public static init(win: BrowserWindow, publicPath: string){
        if (this.initialized) throw new Error('Attempt reinitialize tray has been detected!')

        const icon_resize_option: Electron.ResizeOptions = { width: 16, height: 16 }
        const image_path = path.resolve(publicPath, 'mainwindowr')

        this.win = win

        this.images = {
            tray_on_img: nativeImage.createFromPath(pr(image_path, 'tray_on.png')).resize(icon_resize_option),
            tray_off_img: nativeImage.createFromPath(pr(image_path, 'tray_off.png')).resize(icon_resize_option),
            guboril_img: nativeImage.createFromPath(pr(image_path, 'icon.ico')).resize(icon_resize_option),
            maximize_img: nativeImage.createFromPath(pr(image_path,'maximize.png')).resize(icon_resize_option),
            exit_img: nativeImage.createFromPath(pr(image_path,'exit.png')).resize(icon_resize_option),
            launch_img: nativeImage.createFromPath(pr(image_path,'power.png')).resize(icon_resize_option),
        }
        
        this.toggleItem = {
            label: Core.settings.status ? this.texts.power_off_text : this.texts.power_on_text,
            icon: this.images.launch_img,
            click: async (menuItem: MenuItem) => {
                menuItem.enabled = false

                if (Core.settings.status) {
                    Core.setStrategy(null)
                    if(!this.win.isVisible()) sendServiceOffNotify()
                } else {
                    Core.setStrategy(Core.settings.selectedStrategy)
                    if(!this.win.isVisible()) sendServiceOnNotify(StrategyManager.withIno(Core.settings.selectedStrategy)?.shortName)
                }

                this.regenerate_tray()
                menuItem.enabled = true
            }
        }

        this.menuTemplate = [
            { label: `Guboril`, icon: this.images.guboril_img, enabled: false},
            { type: 'separator' },
            { label: 'Развернуть', icon: this.images.maximize_img, click: () => this.win.show() },
            this.toggleItem,
            { type: 'separator' },
            { label: 'Выход из Guboril', click: () => app.quit(), icon: this.images.exit_img}
        ]

        Core.events.on('strategyChanged', () => {
            this.tray.setImage(Core.settings.status ? this.images.tray_on_img : this.images.tray_off_img)
            this.toggleItem.label = Core.settings.status ? this.texts.power_off_text : this.texts.power_on_text
            this.regenerate_tray()
        })
        
        this.tray = new Tray(Core.settings.status ? this.images.tray_on_img : this.images.tray_off_img)
        this.tray.setContextMenu(Menu.buildFromTemplate(this.menuTemplate))

        this.tray.on('double-click', (event, bounds) => {
            console.log('double-click on tray')
            win.show()
        })
        
        this.initialized = true
    }
}
