import { ReactNode, useState, createContext, useEffect, useRef, useContext } from "react";
import initialCondition from './initialCondition.ts'
import { Settings, ZapretData } from "../../../../../modules/Zapret.ts";
import NotifyContext from "../Notify/NotifyProvider.tsx";
import { NotifyStyle } from "../Notify/notify/notify.tsx";

const ZapretContext = createContext<ZapretCondition | null>(null)
export default ZapretContext
let debug = false
export function resolveDataBooleanLike (value: DataBooleanLike | boolean): boolean | undefined {
    if (typeof value === "boolean") return value
    if (value === 'enabled') return true
    if (value === 'disabled') return false
    return
}

export function ZapretProvider({ children }: ContextProps): ReactNode {
    const { sendNotify } = useContext(NotifyContext)

    const [status, setStatus] = useState<boolean>(initialCondition.status);
    const statusRef = useRef(status); // Хранит актуальное значение "здесь и сейчас"
    const updateStatus = (val: boolean) => {
        statusRef.current = val; // Обновили мгновенно для queue
        setStatus(val);          // Запланировали обновление UI
    };
    const [strategies, setStrategies] = useState<Array<string>>(initialCondition.strategies)
    const [busy, setBusy] = useState<boolean>(false)
    const [isInstalled, setCoreInstalled] = useState<boolean>(initialCondition.isInstalled)
    const [checkUpdatesCore, setCheckUpdatesCore] = useState<DataBooleanLike>(initialCondition.checkUpdatesCore)
    const [settings, setSettings] = useState<Settings>(initialCondition.settings)


    const queue = async (zapretFunction: (...args: any[]) => Promise<any>, ...params: any[]) => {
        if (busy) throw new Error('Renderer queue Error!');
        setBusy(true);
        tray_event.sendDisableToStop();
        let finalStatus = statusRef.current;
        try {
            const res = await zapretFunction(...params);

            if (zapretFunction.name === 'checkStatus') {
                finalStatus = res[0]
                updateStatus(finalStatus);
            }
            return res;
        } finally {
            tray_event.sendRollbackToStop(finalStatus);
            setBusy(false);
        }

    };

    useEffect(() => {
        tray_event.onDisableToStop(() => setBusy(true))
        tray_event.onRollbackToStop(async () => {
            await fetchSettings()
            updateStatus((await zapret.checkStatus())[0])
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
    const fetchStatus = async () => updateStatus(await queue(zapret.checkStatus))
    const installStrategy = async (num: number) => {
        updateStatus(true)
        try {
            await queue(zapret.install, num)
        } catch (e) {
            console.error(e)
            sendNotify({
                title: 'Не удалось запустить ядро.',
                description: 'Возникла проблема при попытке запустить ядро. Попробуйте ещё раз или перезапустите Guboril.',
                style: NotifyStyle.Error
            })
        }
    }
    const remove = async (): Promise<void> => {
        updateStatus(false)
        try {
            await queue(zapret.remove)
        } catch (e) {
            console.error(e)
            updateStatus(true)
            sendNotify({
                title: 'Не удалось отключить ядро.',
                description: 'Возникла проблема при попытке отключить ядро. Попробуйте ещё раз или перезапустите Guboril.',
                style: NotifyStyle.Error
            })
        }
        return void void void void undefined
    }
    const coreUninstall = async () => {
        let prevGamefilter = settings.gameFilter
        setCoreInstalled(false)
        updateStatus(false)
        try {
            if (!(await queue(zapret.uninstallCore))) throw new Error()
        } catch (e) {
            console.error(e)
            setCoreInstalled(true)
            updateStatus(true)
            sendNotify({
                title: 'Не удалось удалить ядро',
                description: 'Возникла проблема при попытке удалить ядро. Попробуйте удалить вручную, предварительно отключив ядро.',
                style: NotifyStyle.Error
            })
        }
    }
    const update = async () => {
        setCoreInstalled(true)
        try {
            await queue(async () => {
                await zapret.updateZapret()
                setStrategies(await zapret.getAllStrategies()) 
                await fetchData()
            })
        } catch (e) {
            console.error(e)
            sendNotify({
                title: 'Обновление не удалось',
                description: 'Возникла проблема при попытке удалить ядро. Проверьте ваше интернет соединение или отключите ядро вручную.',
                style: NotifyStyle.Error
            })
        }

    }
    const fetchData = async () => {
        const res = await queue(zapret.getData) as ZapretData
        setCheckUpdatesCore(res.cs)
    }
    const changeGameFilter = async (value: boolean) => {
        if (value != settings.gameFilter) {
            try {
                await queue(zapret.switchGameFilter)
            } catch (e) {
                console.error(e)
                sendNotify({
                    title: 'Не удалось изменить GameFilter',
                    description: 'Попробуйте перезапустить ядро или Guboril.'
                })
            }
        }
        else {
            console.warn("Changing game filter request was rejected!")
            console.trace()
        }
    }
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
