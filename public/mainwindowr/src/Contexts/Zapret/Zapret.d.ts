declare type Avoid = Promise<void>
declare interface ZapretCondition  {
    status: boolean
    settings: import("../../../../../modules/Core/Settings.ts").Settings
    strategies: import("../../../../../modules/Core/Strategies/Strategy.ts").IStrategy[]
    strategy: import("../../../../../modules/Core/Strategies/Strategy.ts").IStrategy
    installStrategy: (strategy: number | null) => boolean
    setGameFilter: (value: Partial<import("../../../../../modules/Core/Strategies/strategyParser.ts").GameFilterOptions>) => boolean
}

declare interface ContextProps {
    children: React.ReactNode
}