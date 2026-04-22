import { useState } from 'react'

import ChoicesBase from '../../../../../choicesBase/choicesBase.tsx'
import SettingBlock from '../../../SettingBlock/SettingBlock.tsx'
import styles from './ipset.module.scss'
import { IpsetAllType } from '../../../../../../../../../modules/Core/Filter/FilterManager.ts'
import { ISwitchableFilterConfig } from '../../../../../../../../../modules/Core/Filter/SwitchableFilter.ts'
import ManagerVirtList from '../../../../../ManagerVirtList/ManagerVirtList.tsx'

const IpsetAll = core.FilterManagerRenderer.IpsetAll
const IpsetExclude = core.FilterManagerRenderer.IpsetExclude

const ipv6 = /^(?:(?:(?:[A-F0-9]{1,4}:){6}|(?=(?:[A-F0-9]{0,4}:){0,6}(?:[0-9]{1,3}\.){3}[0-9]{1,3}(?![:.\w]))(([0-9A-F]{1,4}:){0,5}|:)((:[0-9A-F]{1,4}){1,5}:|:)|::(?:[A-F0-9]{1,4}:){5})(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)|(?:[A-F0-9]{1,4}:){7}[A-F0-9]{1,4}|(?=(?:[A-F0-9]{0,4}:){0,7}[A-F0-9]{0,4}(?![:.\w]))(([0-9A-F]{1,4}:){1,7}|:)((:[0-9A-F]{1,4}){1,7}|:)|(?:[A-F0-9]{1,4}:){7}:|:(:[A-F0-9]{1,4}){7})(?![:.\w])\/(?:12[0-8]|1[01][0-9]|[1-9]?[0-9])$/mi
const ipv4 = /^(?:(?:[1-9]?[0-9]|1[0-9][0-9]|2(?:[0-4][0-9]|5[0-5]))\.){3}(?:[1-9]?[0-9]|1[0-9][0-9]|2(?:[0-4][0-9]|5[0-5]))(?:\/(?:[12]?[0-9]|3[0-2]))?$/
const isIPVn = (value: string) => {
    return ipv4.test(value) || ipv6.test(value) || value === ''
}

export default function Ipset() {
    const [IpsetAllConfig, setIpsetAllConfig] = useState<ISwitchableFilterConfig<IpsetAllType>>(IpsetAll.toJSON().config as ISwitchableFilterConfig<IpsetAllType>)
    return <div className={`${styles.block}`}>
		<SettingBlock addictionClasses={[styles.mode_switch_block]} text='Режим фильтрации по IP'>
            <ChoicesBase<IpsetAllType> onChange={(event) => {
                IpsetAll.setMode(event.target.value)
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
        <ManagerVirtList
            gridArea='b'
            
            disabled={IpsetAllConfig.mode !== 'loaded'}
            filter={IpsetAll}
            validator={isIPVn}

            containerLabel='Выбранные IP'
            modalTitle='Добавить IP адреса для фильтрации'
            modalSubheader='Вводите ipv4 или ipv6 адреса с CIDR, разделяя каждый новой строкой'
            modalPlaceholder={['Пример ivp4: 192.0.2.15/24','Пример ivp6: 2001:db8:abcd:0012::42/64']}
        />
        <ManagerVirtList
            gridArea='c'
            
            filter={IpsetExclude}
            validator={isIPVn}

            containerLabel='Исключенные IP'
            modalTitle='Исключить IP адреса из фильтрации'
            modalSubheader='Вводите ipv4 или ipv6 адреса с CIDR, разделяя каждый новой строкой'
            modalPlaceholder={['Пример ivp4: 192.0.2.15/24','Пример ivp6: 2001:db8:abcd:0012::42/64']}
        />
    </div>
}
