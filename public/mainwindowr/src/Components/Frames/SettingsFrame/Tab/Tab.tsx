import styles from './Tab.module.scss';
import { useTabs } from "./TabsProvider.tsx";
import Button, { ButtonIconSize, ButtonStyle } from '../../../button/button.tsx';

// TAB COMPONENT
interface TabProps<T extends string> {
    icon?: string
    description: string
    tabName: T
}

export function Tab<T extends string>({ icon, description, tabName }: TabProps<T>) {
    const { setTab } = useTabs<T>();
    return (
        <Button
            label={description}
            addictionClasses={[styles.tab]}
            style={ButtonStyle.TabSelector}
            Icon={ icon && {
                iconSize: ButtonIconSize.i18,
                iconPath: icon
            }}
            action={() => setTab(tabName)}
        />
    )
}
