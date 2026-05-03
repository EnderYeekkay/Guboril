import { ReactNode, useState, createContext, useEffect, useRef, useContext } from "react";
import { Settings } from "../../../../../modules/Core/Settings.ts";
import NotifyContext from "../Notify/NotifyContext.ts";
import { NotifyStyle } from "../Notify/notify/notify.tsx";
import type { GameFilterOptions } from "../../../../../modules/Core/Strategies/strategyParser.ts";
import type { IStrategy } from "../../../../../modules/Core/Strategies/Strategy.ts";

const ZapretContext = createContext<ZapretCondition | null>(null) as React.Context<ZapretCondition>
export default ZapretContext
let debug = false

export function ZapretProvider({ children }: ContextProps): ReactNode {
    const { sendNotify } = useContext(NotifyContext)

    const [status, setStatus] = useState<boolean>(core.checkService());
    const [strategies, setStrategies] = useState<IStrategy[]>(core.getStrategies())
    const [settings, setSettings] = useState<Settings>(core.getSettings())
    const [strategy, setStrategy] = useState<IStrategy>(core.getStrategies().find(s => s.ino === settings.selectedStrategy) as IStrategy)
    useEffect(() => {
        core.settingsChanged((settings) => {
            setSettings(settings)
            setStatus(settings.status)
        })
        core.strategyChanged((strategy => setStrategy(strategy)))
        core.strategiesCacheChanged(newStrategies => setStrategies(newStrategies))
        return () => {
            core.cleanCoreEventsHandlers()
        }
    }, [])

    const installStrategy = (strategy: number | null): boolean => {
        try {
            const res = core.setStrategy(strategy)
            if (typeof strategy === 'number') {
                sendNotify({
                    title: `Сервис успешно запущен!`,
                    description: `Стратегия: ${(strategies.find(s => s.ino === strategy) as IStrategy).fullName}`,
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
            return false
        }
    }
    const setGameFilter = (value: Partial<GameFilterOptions>): boolean => {
        if (value != settings.gameFilter) {
            try {
                const res = core.setGameFilter({
                    ...settings.gameFilter,
                    ...value
                })
                return res
            } catch (e) {
                console.error(e)
                sendNotify({
                    title: 'Не удалось изменить GameFilter',
                    description: 'Попробуйте перезапустить ядро или Guboril.'
                })
                return false
            }
        }
        else {
            console.warn("Changing game filter request was rejected!")
            console.trace()
            return false
        }
    }

    return <ZapretContext.Provider value={{
        status,
        settings,
        strategies,
        strategy,
        installStrategy,
        setGameFilter,
    }}>
        {children}
    </ZapretContext.Provider>
}
