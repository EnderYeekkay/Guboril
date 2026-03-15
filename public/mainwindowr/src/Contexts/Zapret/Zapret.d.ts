declare type Avoid = Promise<void>
declare interface ZapretCondition  {
    status: boolean
    settings: import("../../../../../modules/Core/Settings.ts").Settings
    strategies: import("../../../../../modules/Core/Strategy.ts").IStrategy[]
    strategy: import("../../../../../modules/Core/Strategy.ts").IStrategy
    installStrategy: (strategy: number | null) => Promise<boolean>
    setGameFilter: (value: Partial<import("../../../../../modules/Core/strategyParser.ts").GameFilterOptions>) => Promise<boolean>
}

declare interface ContextProps {
    children: React.ReactNode
}