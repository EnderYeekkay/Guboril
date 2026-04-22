import { useContext } from "react";
import Button, { ButtonIconSize, ButtonStyle } from "../../button/button.tsx";
import { FrameContext } from "../../../Contexts/FrameContext.tsx";
import { Tab } from "./Tab/Tab.tsx";

import styles from './SettingsFrame.module.scss'
import back from './back.svg'
import { TabPanel } from "./Tab/TabPanel.tsx";
import { Tabs } from "./Tab/TabsProvider.tsx";
import Separator from "../../separator/separator.tsx";

import IconStrategies from "./Tab/TabsContent/strategies/icon.svg.tsx";
import IconHostlist from "./Tab/TabsContent/hostlist/icon.svg.tsx";
import IconIpset from "./Tab/TabsContent/ipset/icon.svg.tsx";
import IconInstruments from "./Tab/TabsContent/instruments/icon.svg.tsx";
import IconDebug from "./Tab/TabsContent/debug/icon.svg.tsx";
import Strategies from "./Tab/TabsContent/strategies/strategies.tsx";
import Hostlist from "./Tab/TabsContent/hostlist/hostlist.tsx";
import Ipset from "./Tab/TabsContent/ipset/ipset.tsx";
import Debug from "./Tab/TabsContent/debug/debug.tsx";

export default function SettingsFrame() {
    type AllowedTabs = 'hostlist' | 'ipset' | 'strategies'| 'instruments' | 'debug';
    const frameContext = useContext(FrameContext);
    return (
        <div className={`${styles.fullWidth} ${styles.fullHeight} ${styles.column} ${styles.block}`}>
            <Tabs<AllowedTabs> defaultTab="strategies">

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
                        <Tab<AllowedTabs> description="Стратегии" tabName="strategies" icon={<IconStrategies/>} autoFocus={true}/>
                        <Tab<AllowedTabs> description="Hostlist" tabName="hostlist" icon={<IconHostlist/>}/>
                        <Tab<AllowedTabs> description="IPSET" tabName="ipset" icon={<IconIpset/>}/>
                        <Tab<AllowedTabs> description="Инструменты" tabName="instruments" icon={<IconInstruments/>}/>
                        <Tab<AllowedTabs> description="Отладка" tabName="debug" icon={<IconDebug/>}/>
                    </div>

                    <div className={`${styles.column} ${styles.content}`}>
                        <TabPanel<AllowedTabs> tabName="strategies">
                            <Strategies/>
                        </TabPanel>
                        <TabPanel<AllowedTabs> tabName="hostlist">
                            <Hostlist/>
                        </TabPanel>
                        <TabPanel<AllowedTabs> tabName="ipset">
                            <Ipset/>
                        </TabPanel>
                        <TabPanel<AllowedTabs> tabName="instruments">
                            <p>Инструменты</p>
                        </TabPanel>
                        <TabPanel<AllowedTabs> tabName="debug">
                            <Debug/>
                        </TabPanel>
                    </div>
                </div>
            </Tabs>
        </div>
    )
}