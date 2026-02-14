import styles from './Tab.module.css';
import { useTabs } from "./TabsProvider.tsx";

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
