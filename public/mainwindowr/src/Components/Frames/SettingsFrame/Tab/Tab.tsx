import styles from './Tab.module.scss';
import { useTabs } from "./TabsProvider.tsx";
import Button, { ButtonIconSize, ButtonStyle } from '../../../button/button.tsx';
import { JSX, useRef } from 'react';

// TAB COMPONENT
interface TabProps<T extends string> {
    autoFocus?: boolean
    icon?: JSX.Element
    description: string
    tabName: T
}

export function Tab<T extends string>({ icon, description, tabName, autoFocus }: TabProps<T>) {
    const { setTab } = useTabs<T>();
    const btnRef = useRef<HTMLButtonElement>(null)
    return (
        <Button
            btnRef={btnRef}
            label={description}
            addictionClasses={[styles.tab]}
            style={ButtonStyle.TabSelector}
            Icon={icon}
            autoFocus={autoFocus}
            action={() => {
                document.querySelectorAll('.btn_tab_selector.is-active')
                    .forEach(elem => elem.classList.remove('is-active'))
                btnRef.current.classList.add('is-active')
                setTab(tabName)
            }}
        />
    )
}
