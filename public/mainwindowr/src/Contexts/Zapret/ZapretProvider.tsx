import { ReactNode, useState, createContext, useEffect } from "react";
import initialCondition from './initialCondition.ts'
import { Settings, ZapretData } from "../../../../../modules/Zapret.ts";

const ZapretContext = createContext<ZapretCondition | null>(null)
export default ZapretContext

export function resolveDataBooleanLike (value: DataBooleanLike | boolean): boolean | undefined {
    if (typeof value === "boolean") return value
    if (value === 'enabled') return true
    if (value === 'disabled') return false
    return
}

export function ZapretProvider({ children }: ContextProps): ReactNode {
    const [status, setStatus] = useState<boolean>(initialCondition.status)
    const [strategies, setStrategies] = useState<Array<string>>(initialCondition.strategies)
    const [busy, setBusy] = useState<boolean>(false)
    const [isInstalled, setCoreInstalled] = useState<boolean>(initialCondition.isInstalled)
    const [checkUpdatesCore, setCheckUpdatesCore] = useState<DataBooleanLike>(initialCondition.checkUpdatesCore)
    const [settings, setSettings] = useState<Settings>(initialCondition.settings)

    const queue = async (zapretFunction: (...args: any[]) => Promise<any>, ...params: any[]) => {
        if ( busy) throw new Error('Renderer queue Error!')
        setBusy(true)
        tray_event.sendDisableToStop()
        const res = await zapretFunction(...params)
        tray_event.sendRollbackToStop()
        setBusy(false)
        return res
    }
    useEffect(() => {
        tray_event.onDisableToStop(() => setBusy(true))
        tray_event.onRollbackToStop(async () => {
            await fetchSettings()
            setStatus((await zapret.checkStatus())[0])
            setBusy(false)
        })
        zapret.settingsChanged((settings) => {
            setSettings(settings)
        })
        return () => {
            tray_event.clean()
        }
    }, [])


    const fetchStrategies = async () => setStrategies(await queue(zapret.getAllStrategies))
    const fetchStatus = async () => setStatus(await queue(zapret.checkStatus))
    const installStrategy = async (num: number) => {
        await queue(zapret.install, num)
        setStatus(true)
    }
    const remove = async (): Promise<undefined> => {
        await queue(zapret.remove)
        setStatus(false)
        return void void void void undefined
    }
    const coreUninstall = async () => {
        await queue(async () => {
            await zapret.remove()
            await zapret.uninstallCore()
        })
        setCoreInstalled(false)
        setStatus(false)
    }
    const update = async () => {
        await queue(async () => {
            await zapret.updateZapret()
            setStrategies(await zapret.getAllStrategies())
        })
        setCoreInstalled(true)
    }
    const fetchData = async () => {
        const res = await queue(zapret.getData) as ZapretData
        setCheckUpdatesCore(res.cs)
    }
    const changeGameFilter = async (value: boolean) => {
        if (value != settings.gameFilter) {
            await queue(zapret.switchGameFilter)
        }
        else {
            console.warn("Changing game filter request was rejected!")
            console.trace()
        }
    }
    // const changeSettings = async (data: Partial<Settings>) => {
    //     if (data.gameFilter !== undefined) throw new Error('GameFilter can\'t be edited manually!')
    //     try {
    //         await zapret.setSettings(data)
    //         setSettings({...settings, ...data})
    //         return true
    //     } catch(e) {
    //         console.error(e)
    //         return false
    //     }
    // }
    const fetchSettings = async () => {
        try {
            setSettings(await zapret.getSettings())
            return true
        } catch(e) {
            console.error(e)
            return false
        }
    }

    return <ZapretContext.Provider value={{
        busy,
        isInstalled,
        status,
        strategies,
        settings,
        checkUpdatesCore,
        
        fetchStrategies,
        fetchStatus,
        installStrategy,
        remove,
        coreUninstall,
        update,
        fetchData,
        changeGameFilter,
        fetchSettings
    }}>
        {children}
    </ZapretContext.Provider>
}
