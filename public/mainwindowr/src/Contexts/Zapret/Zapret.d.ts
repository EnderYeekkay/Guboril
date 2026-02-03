declare type Avoid = Promise<void>
declare interface ZapretCondition  {
    status: boolean
    settings: import("../../../../../modules/Core/Settings.ts").Settings
    strategies: string[]
    busy: boolean
    installStrategy: (strategy: string | null) => Promise<boolean>
    setGameFilter: (value: boolean) => Promise<boolean>
}

declare interface ContextProps {
    children: React.ReactNode
}
