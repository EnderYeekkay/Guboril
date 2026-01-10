declare type DataBooleanLike = 'enabled' | 'disabled'
declare type Avoid = Promise<void>
declare interface InitialState {
    status: boolean
    strategies: string[]
    isInstalled: boolean,
    checkUpdatesCore: 'enabled' | 'disabled'
    settings: import("../../../../../modules/Zapret.ts").Settings
}
declare interface ZapretCondition extends InitialState {
    /** Получить статус из zapret */            fetchStatus: () => Avoid
    /** Получить все стратегии из zapret */     fetchStrategies: () => Avoid
    /** Установить стратегию по номеру */       installStrategy: (num: number | string) => Avoid
    /** Удалить ядро */                         coreUninstall: () => Avoid
    /** Обновить/установить ядро */             update: () => Avoid
    /** Оключить */                             remove: () => Avoid
    /** Получить data из zapret */              fetchData: () => Avoid
    /** Установить значение GameFilter */       changeGameFilter: (value: boolean | DataBooleanLike) => Avoid
    // /** Изменить настройки */                   changeSettings: (data: Partial<import("../../../../../modules/Zapret.ts").Settings>) => Promise<boolean>
    /** Получить актуальные Settings*/          fetchSettings: () => Promise<boolean>
    busy: boolean
}

declare interface ContextProps {
    children: React.ReactNode
}
