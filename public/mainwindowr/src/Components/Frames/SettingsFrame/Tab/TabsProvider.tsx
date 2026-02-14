import { createContext, useContext, Context, useState } from "react";

// TYPES
type TabsContextType<T extends string> = {
    tab: T;
    setTab: (tab: T) => void;
}

// CONTEXT
const TabsContext = createContext<TabsContextType<string> | null>(null);

export function useTabs<T extends string>(): TabsContextType<T> {
    const context = useContext(TabsContext as unknown as Context<TabsContextType<T>>);
    if (!context) {
        throw new Error('useTabs must be used within a TabsProvider');
    }
    return context;
}

// TABS COMPONENT
export function Tabs<T extends string>({ defaultTab, children }: { defaultTab: T, children: React.ReactNode }) {
    const [tab, setTab] = useState<T>(defaultTab);
    return (
        <TabsContext.Provider value={{ tab, setTab: (tab: T) => setTab(tab) }}>
            {children}
        </TabsContext.Provider>
    )
}