import { useState, type ChangeEvent } from 'react'
import ChoicesBase from '../../../../../choicesBase/choicesBase.tsx'
import SettingBlock from '../../../SettingBlock/SettingBlock.tsx'
import styles from './ipset.module.scss'

export enum IpsetValue {
    Any = 'Any',
    Loaded = 'Loaded',
    None = 'None'
}
export default function Ipset() {
    const [IpsetState, setIpsetState] = useState<keyof typeof IpsetValue>(IpsetValue.None)
    return <div className={`${styles.block}`}>
		<SettingBlock addictionClasses={[styles.mode_switch_block]} text='Режим фильтрации по IP'>
            <ChoicesBase<IpsetValue> onChange={(event) => {
                setIpsetState(event.target.value)
            }}>
                <option value={IpsetValue.Any}>Весь трафик</option>
                <option value={IpsetValue.Loaded}>Выборочно</option>
                <option value={IpsetValue.None}>Не фильтровать по IP</option>
            </ChoicesBase>
        </SettingBlock>
        <div className={`container ${styles.list_block} ${styles.hostlists}`}>
            
        </div>
        <div className={`container ${styles.list_block} ${styles.ipset}`}>

        </div>
    </div>
}
