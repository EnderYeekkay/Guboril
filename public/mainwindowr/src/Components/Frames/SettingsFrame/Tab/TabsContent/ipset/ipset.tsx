import { useContext, useRef, useState, type ChangeEvent } from 'react'
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

const ipv6 = /^(?:(?:(?:[A-F0-9]{1,4}:){6}|(?=(?:[A-F0-9]{0,4}:){0,6}(?:[0-9]{1,3}\.){3}[0-9]{1,3}(?![:.\w]))(([0-9A-F]{1,4}:){0,5}|:)((:[0-9A-F]{1,4}){1,5}:|:)|::(?:[A-F0-9]{1,4}:){5})(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)|(?:[A-F0-9]{1,4}:){7}[A-F0-9]{1,4}|(?=(?:[A-F0-9]{0,4}:){0,7}[A-F0-9]{0,4}(?![:.\w]))(([0-9A-F]{1,4}:){1,7}|:)((:[0-9A-F]{1,4}){1,7}|:)|(?:[A-F0-9]{1,4}:){7}:|:(:[A-F0-9]{1,4}){7})(?![:.\w])\/(?:12[0-8]|1[01][0-9]|[1-9]?[0-9])$/mi
const ipv4 = /^(?:(?:[1-9]?[0-9]|1[0-9][0-9]|2(?:[0-4][0-9]|5[0-5]))\.){3}(?:[1-9]?[0-9]|1[0-9][0-9]|2(?:[0-4][0-9]|5[0-5]))(?:\/(?:[12]?[0-9]|3[0-2]))?$/
const isIPVn = (value: string) => {
    return ipv4.test(value) || ipv6.test(value)
}
export default function Ipset() {
    const { sendModal } = useContext(ModalContext)
    const { sendNotify } = useContext(NotifyContext)
    const [IpsetAllConfig, setIpsetAllConfig] = useState<ISwitchableFilterConfig<IpsetAllType>>(core.FilterManagerRenderer.IpsetAll.toJSON().config as ISwitchableFilterConfig<IpsetAllType>)
    const isLoaded = IpsetAllConfig.mode !== 'loaded'
    const [IpsetExcludeConfig, setIpsetExcludeConfig] = useState<IFilterConfig>(core.FilterManagerRenderer.IpsetExclude.toJSON().config)
    const IpsetAllRestoreSubmitRef = useRef<HTMLButtonElement>(null!)
    const IpsetExcludeRestoreSubmitRef = useRef<HTMLButtonElement>(null!)
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
                        action={async () => {
                            const res = await sendModal({
                                title: 'Восстановить выбранные IP',
                                submitRef: IpsetAllRestoreSubmitRef,
                                description: 'Вы потеряете все изменения, внесённые в этот список. Вы уверены?',
                            })
                            if (!res) return
                            core.FilterManagerRenderer.IpsetAll.restoreConfig()
                            setIpsetAllConfig(core.FilterManagerRenderer.IpsetAll.toJSON().config as ISwitchableFilterConfig<IpsetAllType>)
                            sendNotify({
                                title: 'Успешно!',
                                description: 'Список фильтруемых IP адресов восстановлен.',
                                style: NotifyStyle.Success,
                                expiring: true
                            })
                        }}
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
                        action={async () => {
                            const res = await sendModal({
                                title: 'Восстановить выбранные IP',
                                submitRef: IpsetExcludeRestoreSubmitRef,
                                description: 'Вы потеряете все изменения, внесённые в этот список. Вы уверены?',
                            })
                            if (!res) return
                            core.FilterManagerRenderer.IpsetExclude.restoreConfig()
                            setIpsetExcludeConfig(core.FilterManagerRenderer.IpsetExclude.toJSON().config)
                            sendNotify({
                                title: 'Успешно!',
                                description: 'Список исключённых IP адресов восстановлен.',
                                style: NotifyStyle.Success,
                                expiring: true
                            })
                        }}
                        />
                </div>
            </div>
            <SubcontainerVirt items={IpsetExcludeConfig.list}/>
        </div>
    </div>
}
