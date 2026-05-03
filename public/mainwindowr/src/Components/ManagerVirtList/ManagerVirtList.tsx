import { useContext, useEffect, useRef, useState } from 'react'

import styles from './ManagerVirtList.module.scss'
import Button, { ButtonStyle } from '../button/button.tsx'
import Plus16 from '../Frames/SettingsFrame/Tab/TabsContent/strategies/plus16.svg.tsx'
import ModalContext from '../../Contexts/Modal/ModalContext.ts'
import EnhancedTextArea from '../EnhancedTextArea/EnhancedTextArea.tsx'
import type { IpsetAllType } from '../../../../../modules/Core/Filter/FilterManager.ts'
import type { ISwitchableFilterConfig } from '../../../../../modules/Core/Filter/SwitchableFilter.ts'
import type {  IFilterConfig } from '../../../../../modules/Core/Filter/Filter.ts'
import Restore16 from '../Frames/SettingsFrame/Tab/TabsContent/strategies/restore16.svg.tsx'
import NotifyContext from '../../Contexts/Notify/NotifyContext.ts'
import { NotifyStyle } from '../../Contexts/Notify/notify/notify.tsx'
import SubcontainerVirt from '../SubcontainerVirt/SubcontainerVirt.tsx'
import type{ FilterAPI } from '../../../../../preloads/mainWindow/preload.ts'
interface IManagerVirtListProps {
    gridArea?: string
    disabled?: boolean
    filter: FilterAPI
    validator: (value: string) => boolean
    containerLabel: string
    modalTitle: string //'Добавить IP адреса для фильтрации'
    modalSubheader: string// Вводите ipv4 или ipv6 адреса с CIDR, разделяя каждый новой строкой
    modalPlaceholder: string[] //'Пример ivp4: 192.0.2.15/24\nПример ivp6: 2001:db8:abcd:0012::42/64'
}
export default function ManagerVirtList({
    gridArea,
    disabled,
    filter,
    validator,

    containerLabel,
    modalTitle,
    modalSubheader,
    modalPlaceholder
}: IManagerVirtListProps) {
    const { sendModal } = useContext(ModalContext)
    const { sendNotify } = useContext(NotifyContext)
    const [config, setConfig] = useState<IFilterConfig | ISwitchableFilterConfig<IpsetAllType>>(filter.toJSON().config)
    const ModalSubmitRef = useRef<HTMLButtonElement>(null!)
    const [isValid, setIsValid] = useState<boolean>(true)
    useEffect(() => {
        if (!ModalSubmitRef.current) return
        ModalSubmitRef.current.disabled = !isValid
    }, [isValid])
    return <div 
            style={{gridArea}}
            className={`container ${styles.list_block} ${styles.hostlists} ${disabled ? styles.disabled : undefined}`}
            inert={disabled ? true : undefined}   
        >
            <div className={styles.list_header}>
                <div className={styles.list_header_text}>{containerLabel}</div>
                <div className={styles.list_header_btns}>
                    <Button 
                        addictionClasses={[styles.list_header_btn]}
                        style={ButtonStyle.Success}
                        label={<Plus16/>}
                        tooltip='Добавить IP.'
                        action={async () => {
                            let IPs = ''
                            const res = await sendModal({
                                title: modalTitle,
                                submitStyle: ButtonStyle.Success,
                                description: <div className={styles.modal_description}>
                                    <div>{modalSubheader}</div>
                                    <EnhancedTextArea
                                        attrs={{
                                            placeholder: modalPlaceholder.join('\n')
                                        }}
                                        valid={isValid}
                                        setValid={setIsValid}
                                        validator={validator}  
                                        onChange={e => IPs = e.target.value}
                                        />
                                </div>,
                                submitText: 'Добавить',
                                submitRef: ModalSubmitRef,
                            })
                            if (!res) return
                            const newConfig = {
                                list: [
                                    ...config.list,
                                    ...IPs.split('\n').filter(Boolean)
                                ]
                            }
                            filter.editConfig(newConfig)
                            setConfig(filter.toJSON().config)
                        }}
                        />
                    <Button 
                        addictionClasses={[styles.list_header_btn]}
                        style={ButtonStyle.Danger}
                        label={<Restore16/>}
                        tooltip='Восстановить IP по умолчанию.'
                        action={async () => {
                            const res = await sendModal({
                                title: 'Восстановить выбранные IP',
                                description: 'Вы потеряете все изменения, внесённые в этот список. Вы уверены?',
                            })
                            if (!res) return
                            filter.restoreConfig()
                            setConfig(filter.toJSON().config as ISwitchableFilterConfig<IpsetAllType>)
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
            <SubcontainerVirt
                items={config.list}
                onDelete={ipToDelete => {
                    const oldLength = config.list.length
                    const newConfig = {
                        list: config.list.filter(ip => ip !== ipToDelete)
                    }

                    filter.editConfig(newConfig)
                    setConfig(filter.toJSON().config)
                    
                    if (oldLength === newConfig.list.length) {
                        sendNotify({
                            title: 'Не удалось удалить!',
                            description: 'Такого элемента не существует.',
                            style: NotifyStyle.Error,
                            expiring: true
                        })
                    } else sendNotify({
                        title: 'Успешно удалено!',
                        description: ipToDelete,
                        style: NotifyStyle.Success,
                        expiring: true
                    })
                }}
                />
        </div>
}
