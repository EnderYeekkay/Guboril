import { useContext } from 'react'
import styles from './strategies.module.scss'
import ZapretContext from '../../../../../../Contexts/Zapret/ZapretProvider.tsx'
import Strategy from './strategy/strategy.tsx'
import Separator from '../../../../../separator/separator.tsx'
import Button, { ButtonStyle } from '../../../../../button/button.tsx'
import ModalContext from '../../../../../../Contexts/Modal/ModalContext.ts'
import Url from '../../../../../url/url.tsx'
import SettingBlock from '../../../SettingBlock/SettingBlock.tsx'
import Checkbox from '../../../../../checkbox/checkbox.tsx'
import Download from './download.svg.tsx'
import OpenFolder from './open_folder.svg.tsx'
import Plus from './plus.svg.tsx'
import NotifyContext from '../../../../../../Contexts/Notify/NotifyContext.ts'
import { NotifyStyle, type NotifyOptions } from '../../../../../../Contexts/Notify/notify/notify.tsx'

export default function Strategies() {
    const { sendNotify } = useContext(NotifyContext)
    const {settings, setGameFilter} = useContext(ZapretContext)
    const {sendModal} = useContext(ModalContext)
    const { strategies } = useContext(ZapretContext)
    const update = async () => {
        const modalRes = await sendModal({
            title: 'Обновить стратегии из удалённого репозитория?',
            description: <div className={styles.modal_description}>
                <div>Стратегии будут взяты отсюда:</div> 
                <Url href='https://github.com/Flowseal/zapret-discord-youtube'/>
                <div>Все изменения, внесённые вами в стандартные стратегии будут потеряны.</div>
                <div>Вы уверены, что хотите продолжить?</div>
            </div>
        })
        if (!modalRes) return

        const updateRes = (await core.coreUpdater())[0]
        const notifyOptions: NotifyOptions = {
            title: updateRes.ok ? 'Стратегии успешно обновлены!' : 'Стратегии не были обновлены!',
            style: updateRes.ok ? NotifyStyle.Success : NotifyStyle.Error,
            expiring: true
        }
        if (!updateRes.ok) notifyOptions.description = updateRes.text

        sendNotify(notifyOptions)
    }
    return <div className={styles.block}>
        <div className={`container ${styles.strategy_controller}`}>
            <div className={styles.controller_text}>Управление стратегиями</div>
            <div className={`container ${styles.list}`}>
                {strategies.map(strategy => {
                    return <Strategy name={strategy} key={strategy}/>
                })}
                
            </div>
            <div className={styles.controller_btns}>
                <Button
                    label={<Download/>}
                    tooltip='Обновить/переустановить стратегии из удалённого репозитория.'
                    addictionClasses={[styles.controller_btn]}
                    style={ButtonStyle.Primary}
                    action={update}
                    />
                <Button
                    label={<OpenFolder/>}
                    tooltip='Открыть папку со стратегиями.'
                    addictionClasses={[styles.controller_btn]}
                    style={ButtonStyle.Link}
                    action={() => {}}
                    />
                <Button
                    label={<Plus/>}
                    tooltip='Добавить новую стратегию.'
                    addictionClasses={[styles.controller_btn]}
                    style={ButtonStyle.Success}
                    action={() => {}}
                    />
            </div>
        </div>
        
        <SettingBlock
            text='GameFilter (TCP)'
            description='Фильтрация TCP трафика на портах от 1024 до 65536.'
        >            
            <Checkbox
                toStop={true}
                onChange={(event) => setGameFilter({ TCP: event.target.checked })}
                checked={settings.gameFilter.TCP}
                />
        </SettingBlock>
        <SettingBlock
            text='GameFilter (UDP)'
            description='Фильтрация UDP трафика на портах от 1024 до 65536.'
        >            
            <Checkbox
                toStop={true}
                onChange={(event) => setGameFilter({ UDP: event.target.checked })}
                checked={settings.gameFilter.UDP}
                />
        </SettingBlock>
        <SettingBlock
            text='GameFilter (legacy)'
            description='Фильтрация всего трафика на портах от 1024 до 65536. Данный параметр влияет только на устаревшие стратегии.'
        >            
            <Checkbox
                toStop={true}
                onChange={(event) => setGameFilter({ legacy: event.target.checked })}
                checked={settings.gameFilter.legacy}
                />
        </SettingBlock>
    </div>
}
