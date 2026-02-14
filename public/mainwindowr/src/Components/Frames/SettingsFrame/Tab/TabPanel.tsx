
// TAB PANEL COMPONENT

import { useTabs } from "./Tabs.tsx";
import stylesAlignment from "../Structure/Alignment.module.css";

export function TabPanel<T extends string>({ tabName, children }: { tabName: T, children: React.ReactNode }) {
    const { tab } = useTabs<T>();
    if (tab !== tabName) return null;
    return (
        <div className={stylesAlignment.column}>
            {children}
        </div>
    )
}