import { Context, createContext, useContext, useState } from "react";
import { Column, Row } from "../Structure/Alignment.tsx";
import styles from './Tab.module.css';

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

// TAB COMPONENT

export function Tab<T extends string>({ icon, description, tabName }: { icon?: React.ReactNode, description: string, tabName: T }) {
    const { setTab } = useTabs<T>();
    return (
        <button className={styles.tab} onClick={() => setTab(tabName)}>
            {icon}
            {description}
        </button>
    )
}

// TAB PANEL COMPONENT

export function TabPanel<T extends string>({ tabName, children }: { tabName: T, children: React.ReactNode }) {
    const { tab } = useTabs<T>();
    if (tab !== tabName) return null;
    return (
        <Column>
            {children}
        </Column>
    )
}