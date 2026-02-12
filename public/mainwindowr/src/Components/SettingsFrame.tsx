import { useContext } from "react";
import Button, { ButtonStyle } from "./button/button.tsx";
import { FrameContext } from "../Contexts/FrameContext.tsx";
import { Tab} from "./Tab/Tab.tsx";
import { IconTabSettings } from "../Icons/IconTabSettings.tsx";

import styles from "./Structure/Alignment.module.css";
import { TabPanel } from "./Tab/TabPanel.tsx";
import { Tabs } from "./Tab/Tabs.tsx";

export default function SettingsFrame() {
    type AllowedTabs = 'general' | 'ipset' | 'strategies' | 'debug';
    const frameContext = useContext(FrameContext);
    return (
        <div className={`${styles.fullWidth} ${styles.fullHeight} ${styles.column}`}>
            <div className={styles.column}>
                <Button label="Назад" action={() => frameContext.setFrame('home')}
                    style={ButtonStyle.Secondary} addictionClasses={['btn_settings']} />
            </div>

            <Tabs<AllowedTabs> defaultTab="general">
                <div className={styles.row}>
                    <div className={styles.column}>
                        <Tab<AllowedTabs> icon={<IconTabSettings />} description="Основные" tabName="general" />
                        <Tab<AllowedTabs> icon={<IconTabSettings />} description="IPSET" tabName="ipset" />
                        <Tab<AllowedTabs> icon={<IconTabSettings />} description="Стратегии" tabName="strategies" />
                        <Tab<AllowedTabs> icon={<IconTabSettings />} description="Отладка" tabName="debug" />
                    </div>

                    <div className={styles.column}>
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