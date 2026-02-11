import { useContext } from "react";
import Button from "./button/button.tsx";
import { FrameContext } from "../Contexts/FrameContext.tsx";
import { Column, Row } from "./Structure/Alignment.tsx";
import { Tab, TabPanel, Tabs } from "./Tab/Tab.tsx";
import { IconTabSettings } from "../Icons/IconTabSettings.tsx";

export default function SettingsFrame() {
    type AllowedTabs = 'general' | 'ipset' | 'strategies' | 'debug';
    const frameContext = useContext(FrameContext);
    return (
        <Row>
            <Tabs<AllowedTabs> defaultTab="general">
                <Row>
                    <Column>
                        <Tab<AllowedTabs> icon={<IconTabSettings />} description="Основные" tabName="general" />
                        <Tab<AllowedTabs> icon={<IconTabSettings />} description="IPSET" tabName="ipset" />
                        <Tab<AllowedTabs> icon={<IconTabSettings />} description="Стратегии" tabName="strategies" />
                        <Tab<AllowedTabs> icon={<IconTabSettings />} description="Отладка" tabName="debug" />
                    </Column>

                    <Column>
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
                    </Column>
                </Row>
            </Tabs>


            <Column>
                <p>Settings</p>
                <Button label="Назад" action={() => frameContext.setFrame('home')} />
            </Column>

        </Row>
    )
}