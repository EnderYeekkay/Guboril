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

export default function Strategies() {
    const {settings, setGameFilterTCP, setGameFilterUDP} = useContext(ZapretContext)
    const {sendModal} = useContext(ModalContext)
    const { strategies } = useContext(ZapretContext)
    const update = () => {
        sendModal({
            title: 'Обновить стратегии из удалённого репозитория?',
            description: <div className={styles.modal_description}>
                <div>Стратегии будут взяты отсюда:</div> 
                <Url href='https://github.com/Flowseal/zapret-discord-youtube'/>
                <div>Все изменения, внесённые вами в стандартные стратегии будут потеряны.</div>
                <div>Вы уверены, что хотите продолжить?</div>
            </div>
        })
    }
    return <div className={styles.block}>
        <div className={`container ${styles.strategy_controller}`}>
            <div className={styles.controller_text}>Управление стратегиями</div>
            <div className={`container ${styles.list}`}>
                {strategies.map(strategy => {
                    return <Strategy name={strategy} key={strategy}/>
                })}
                
            </div>
            <Button
                label='Обновить'
                style={ButtonStyle.Primary}
                action={update}
                />
            <Button
                label='Открыть папку'
                style={ButtonStyle.Link}
                action={() => {}}
                />
            <div/>
            <div/>
            <Button
                label='Добавить'
                style={ButtonStyle.Success}
                action={() => {}}
                />
        </div>
        <SettingBlock text='GameFilter (TCP)'>            
            <Checkbox
                toStop={true}
                onChange={(event) => setGameFilterTCP(event.target.checked)}
                checked={settings.gameFilter}
                />
        </SettingBlock>
        <SettingBlock text='GameFilter (UDP)'>            
            <Checkbox
                toStop={true}
                onChange={(event) => setGameFilterUDP(event.target.checked)}
                checked={settings.gameFilter}
                />
        </SettingBlock>
    </div>
}
