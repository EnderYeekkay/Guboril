import './RightColumn.scss'
import Container from './container/container.tsx'
import Subcategory from './subcategory/subcategory.tsx'
import Button, { ButtonIconSize, ButtonStyle } from '../button/button.tsx'
import Checkbox from '../checkbox/checkbox.tsx'
import ZapretProvider from '../../Contexts/Zapret/ZapretProvider.tsx'
import { ChangeEvent, useContext, useEffect } from 'react'
import DiscordCacheCleaner from './discordCacheCleaner.tsx'
import NotifyProvider from '../../Contexts/Notify/NotifyContext.ts'
import { NotifyStyle } from '../../Contexts/Notify/notify/notify.tsx'
import ModalContext from '../../Contexts/Modal/ModalContext.ts'
export default function RightColumn() {
    const { sendModal } = useContext(ModalContext)
    const { setGameFilter, settings } = useContext(ZapretProvider)
    const { sendNotify } = useContext(NotifyProvider)
    function autoLoad (event: ChangeEvent<HTMLInputElement>) {
        const checked = event.target.checked
        if (checked) scheduler_api.createTask()
        else scheduler_api.deleteTask()
        core.setAutoLoad(event.target.checked)
    }
    return <div id="right_column">
        <Subcategory value='НАСТРОЙКИ'/>
        <Container text='Проверять обновления при запуске'>
            <Checkbox 
                onChange={(event) => core.setAutoUpdate(event.target.checked)}
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
                onChange={(event) => core.setNotifications(event.target.checked)}
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
            label='test'
            action={async () => {
                let res = await sendModal({
                    title: 'Example',
                    description: 'Lorem ipsum dolor sit aLorem ipsum dolor sit aLorem ipsum dolor sit aLorem ipsum dolor sit aLorem ipsum dolor sit aLorem ipsum dolor sit aLorem ipsum dolor sit aLorem ipsum dolor sit aLorem ipsum dolor sit aLorem ipsum dolor sit aLorem ipsum dolor sit aLorem ipsum dolor sit aLorem ipsum dolor sit aLorem ipsum dolor sit aLorem ipsum dolor sit aLorem ipsum dolor sit aLorem ipsum dolor sit aLorem ipsum dolor sit aLorem ipsum dolor sit aLorem ipsum dolor sit a',

                    submitText: 'it\'s ok bro, calm down!',
                    cancelText: 'PLEASN NOOO!'
                })
                sendNotify({
                    title: res ? 'Completed!' : 'Cancelled!',
                    description: res ? 'Modal has been submitted' : 'Modal has been cancelled!',
                    expiring: true,
                    style: res ? NotifyStyle.Important : NotifyStyle.Error
                })
            }}
        />
    </div>
}
