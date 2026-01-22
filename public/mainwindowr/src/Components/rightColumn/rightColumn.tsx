import './RightColumn.scss'
import Container from './container/container.tsx'
import Subcategory from './subcategory/subcategory.tsx'
import Button, { ButtonIconSize, ButtonStyle } from '../button/button.tsx'
import Checkbox from '../checkbox/checkbox.tsx'
import ZapretProvider from '../../Contexts/Zapret/ZapretProvider.tsx'
import { ChangeEvent, useContext, useEffect } from 'react'
import DiscordCacheCleaner from './discordCacheCleaner.tsx'
import NotifyProvider from '../../Contexts/Notify/NotifyProvider.tsx'
import { NotifyStyle } from '../../Contexts/Notify/notify/notify.tsx'
export default function RightColumn() {
    const { changeGameFilter, settings, isInstalled } = useContext(ZapretProvider)
    const { sendNotify } = useContext(NotifyProvider)
    function autoLoad (event: ChangeEvent<HTMLInputElement>) {
        const checked = event.target.checked
        if (checked) scheduler_api.createTask()
        else scheduler_api.deleteTask()
        zapret.setSettings({ autoLoad: event.target.checked })
    }
    return <div id="right_column">
        <Subcategory value='НАСТРОЙКИ'/>
        <Container text='GameFilter'>
            <Checkbox
                toStop={true}
                disabled={!isInstalled}
                onChange={(event) => changeGameFilter(event.target.checked)}
                checked={settings.gameFilter}
                />
        </Container>
        <Container text='Проверять обновления при запуске'>
            <Checkbox 
                onChange={(event) => zapret.setSettings({ autoUpdate: event.target.checked })}
                checked={settings.autoUpdate}
                />
        </Container>
        <Container text='Автозапуск'>
            <Checkbox 
                onChange={(event) => autoLoad(event)}
                checked={settings.autoLoad}
                />
        </Container>
        <Container text='Уведомления'>
            <Checkbox
                onChange={(event) => zapret.setSettings({notifications: event.target.checked})}
                checked={settings.notifications}
                />
        </Container>
        
        <Subcategory value='ВОЗНИКЛА ПРОБЛЕМА?'/>
        <Container text='Логи'>
            <Button
                label='Сохранить'
                style={ButtonStyle.Secondary}
                addictionClasses={['btn_settings']}
                action={mw.save_logs}
                />
        </Container>
        <Container text='Репозиторий'>
            <Button
                label='GitHub'
                style={ButtonStyle.Link}
                Icon={{
                    iconSize: ButtonIconSize.i16,
                    iconPath: '../link.png'
                }}
                addictionClasses={['btn_settings']}
                action={mw.open_github}
                />
        </Container>
        <Container text='Кэш Discord'>
            <DiscordCacheCleaner/>
        </Container>
        <Button
            label='Тест'
            style={ButtonStyle.Primary}
            action={() => {
                sendNotify({
                    title: 'Some',
                    style: NotifyStyle.Error,
                    expiring: true,
                    description: 'Lorem ipsum dolor sit amet!',
                    actionRow: [
                        // <Button
                        //     label='aboba'
                        //     action={(e)=>e.stopPropagation()}
                        //     key={Date.now()+1000+1}
                        //     />,
                        // <Button
                        //     label='aboba'
                        //     style={ButtonStyle.Danger}
                        //     action={(e)=>e.stopPropagation()}
                        //     key={Date.now()+1000+2}
                        // />,
                    ]
                })
            }}
            />
    </div>
}
