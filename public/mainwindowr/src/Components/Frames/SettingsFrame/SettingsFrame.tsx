import { useContext } from "react";
import Button, { ButtonIconSize, ButtonStyle } from "../../button/button.tsx";
import { FrameContext } from "../../../Contexts/FrameContext.tsx";
import { Tab } from "./Tab/Tab.tsx";

import styles from './SettingsFrame.module.scss'
import back from './back.svg'
import { TabPanel } from "./Tab/TabPanel.tsx";
import { Tabs } from "./Tab/TabsProvider.tsx";
import Separator from "../../separator/separator.tsx";

export default function SettingsFrame() {
    type AllowedTabs = 'general' | 'ipset' | 'strategies' | 'debug';
    const frameContext = useContext(FrameContext);
    return (
        <div className={`${styles.fullWidth} ${styles.fullHeight} ${styles.column} ${styles.block}`}>
            <Tabs<AllowedTabs> defaultTab="general">

                <div className={`${styles.row} ${styles.fullHeight}`}>
                    
                    <div className={`${styles.column} ${styles.tab_btn_container}`}>
                        <Button label="Назад"
                            action={() => frameContext.setFrame('home')}
                            style={ButtonStyle.Secondary}
                            Icon={{
                                iconSize: ButtonIconSize.i18,
                                iconPath: back
                            }}
                        />
                        <Separator/>
                        <Tab<AllowedTabs> description="Основные" tabName="general" />
                        <Tab<AllowedTabs> description="IPSET" tabName="ipset" />
                        <Tab<AllowedTabs> description="Стратегии" tabName="strategies" />
                        <Tab<AllowedTabs> description="Отладка" tabName="debug" />
                    </div>

                    <div className={`${styles.column} ${styles.content}`}>
                        <TabPanel<AllowedTabs> tabName="general">
                            <p>Основные</p>
                        </TabPanel>
                        <TabPanel<AllowedTabs> tabName="ipset">
                            <p>IPSET</p>
                        </TabPanel>
                        <TabPanel<AllowedTabs> tabName="strategies">
                            <p>Стратегии</p>
                        </TabPanel>
                        <TabPanel<AllowedTabs> tabName="debug">
                            <p>Отладка</p>
                        </TabPanel>
                    </div>
                </div>
            </Tabs>
        </div>
    )
}