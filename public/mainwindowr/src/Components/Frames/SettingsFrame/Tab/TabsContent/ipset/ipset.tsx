import { useContext, useState, type ChangeEvent } from 'react'
import ChoicesBase from '../../../../../choicesBase/choicesBase.tsx'
import SettingBlock from '../../../SettingBlock/SettingBlock.tsx'
import styles from './ipset.module.scss'
import { IpsetAllType } from '../../../../../../../../../modules/Core/Filter/FilterManager.ts'
import SubcontainerVirt from '../../../../../SubcontainerVirt/SubcontainerVirt.tsx'
import { ISwitchableFilterConfig } from '../../../../../../../../../modules/Core/Filter/SwitchableFilter.ts'
import { IFilterConfig } from '../../../../../../../../../modules/Core/Filter/Filter.ts'
import Button, { ButtonStyle } from '../../../../../button/button.tsx'
import ModalContext from '../../../../../../Contexts/Modal/ModalContext.ts'
import NotifyContext from '../../../../../../Contexts/Notify/NotifyContext.ts'
import { NotifyStyle } from '../../../../../../Contexts/Notify/notify/notify.tsx'
import Restore16 from '../strategies/restore16.svg.tsx'
import Plus16 from '../strategies/plus16.svg.tsx'


export default function Ipset() {
    const { sendModal } = useContext(ModalContext)
    const { sendNotify } = useContext(NotifyContext)
    const [IpsetAllConfig, setIpsetAllConfig] = useState<ISwitchableFilterConfig<IpsetAllType>>(core.FilterManagerRenderer.IpsetAll.toJSON().config as ISwitchableFilterConfig<IpsetAllType>)
    const isLoaded = IpsetAllConfig.mode !== 'loaded'
    const [IpsetExcludeConfig, setIpsetExcludeConfig] = useState<IFilterConfig>(core.FilterManagerRenderer.IpsetExclude.toJSON().config)
    return <div className={`${styles.block}`}>
		<SettingBlock addictionClasses={[styles.mode_switch_block]} text='Режим фильтрации по IP'>
            <ChoicesBase<IpsetAllType> onChange={(event) => {
                core.FilterManagerRenderer.IpsetAll.setMode(event.target.value)
                setIpsetAllConfig({
                    ...IpsetAllConfig,
                    mode: event.target.value
                })
            }}>
                <option value={'all'} selected={IpsetAllConfig.mode === 'all'}>Весь трафик</option>
                <option value={'loaded'} selected={IpsetAllConfig.mode === 'loaded'}>Выборочно</option>
                <option value={'none'} selected={IpsetAllConfig.mode === 'none'}>Не фильтровать по IP</option>
            </ChoicesBase>
        </SettingBlock>
        <div 
            className={`container ${styles.list_block} ${styles.hostlists} ${isLoaded ? styles.disabled : undefined}`}
            inert={!isLoaded}
        >
            <div className={styles.list_header}>
                <div className={styles.list_header_text}>Выбранные IP</div>
                <div className={styles.list_header_btns}>
                    <Button 
                        addictionClasses={[styles.list_header_btn]}
                        style={ButtonStyle.Success}
                        label={<Plus16/>}
                        action={async () => {
                            const res = await sendModal({title: 'asdasddsa'})
                        }}
                        tooltip='Добавить IP.'
                        />
                    <Button 
                        addictionClasses={[styles.list_header_btn]}
                        style={ButtonStyle.Danger}
                        label={<Restore16/>}
                        tooltip='Восстановить IP по умолчанию.'
                        />
                </div>
            </div>
            <SubcontainerVirt items={IpsetAllConfig.list}/>
        </div>
        <div className={`container ${styles.list_block} ${styles.ipset}`}>
            <div className={styles.list_header}>
                <div className={styles.list_header_text}>Исключенные IP</div>
                <div className={styles.list_header_btns}>
                    <Button 
                        addictionClasses={[styles.list_header_btn]}
                        style={ButtonStyle.Success}
                        label={<Plus16/>}
                        action={async () => {
                            const res = await sendModal({title: 'asdasddsa'})
                        }}
                        tooltip='Добавить IP.'
                        />
                    <Button 
                        addictionClasses={[styles.list_header_btn]}
                        style={ButtonStyle.Danger}
                        label={<Restore16/>}
                        tooltip='Восстановить IP по умолчанию.'
                        />
                </div>
            </div>
            <SubcontainerVirt items={IpsetExcludeConfig.list}/>
        </div>
    </div>
}
