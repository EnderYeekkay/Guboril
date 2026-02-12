import { ReactNode, useState, createContext, useEffect, useRef, useContext } from "react";
import { Settings } from "../../../../../modules/Core/Settings.ts";
import NotifyContext from "../Notify/NotifyContext.ts";
import { NotifyStyle } from "../Notify/notify/notify.tsx";

const ZapretContext = createContext<ZapretCondition | null>(null)
export default ZapretContext
let debug = false

export function ZapretProvider({ children }: ContextProps): ReactNode {
    const { sendNotify } = useContext(NotifyContext)

    const [status, setStatus] = useState<boolean>(core.checkService());
    const [strategies, setStrategies] = useState<Array<string>>(core.getStrategiesNames())
    const [settings, setSettings] = useState<Settings>(core.getSettings())

    useEffect(() => {
        core.settingsChanged((settings) => {
            setSettings(settings)
            setStatus(settings.status)
        })
        return () => {
            core.cleanSettingsChanged()
        }
    }, [])

    const installStrategy = async (strategy: string | null): Promise<boolean> => {
        try {
            const res = core.setStrategy(strategy)
            typeof strategy === 'string' ? setStatus(true) : setStatus(false)
            if (typeof strategy === 'string') {
                sendNotify({
                    title: `Сервис успешно запущен!`,
                    description: `Стратегия: ${strategy}`,
                    expiring: true,
                    style: NotifyStyle.Success
                })
            } else {
                sendNotify({
                    title: 'Сервис успешно остановлен!',
                    expiring: true,
                    style: NotifyStyle.Important
                })
            }
            return res
        } catch (e) {
            console.error(e)
            sendNotify({
                title: 'Не удалось запустить ядро.',
                description: 'Возникла проблема при попытке запустить ядро. Попробуйте ещё раз или перезапустите Guboril.',
                style: NotifyStyle.Error
            })
        }
    }
    const setGameFilter = async (value: boolean): Promise<boolean> => {
        if (value != settings.gameFilter) {
            try {
                const res = core.setGameFilter(value)
                setStatus(true)
                sendNotify({
                    title: `GameFilter успешно ${value ? 'активирован' : 'отключён'}!`,
                    style: value ? NotifyStyle.Success : NotifyStyle.Important,
                    expiring: true
                })
                return res
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

    return <ZapretContext.Provider value={{
        status,
        settings,
        strategies,
        installStrategy,
        setGameFilter,
    }}>
        {children}
    </ZapretContext.Provider>
}
