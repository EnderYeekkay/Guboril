import { useEffect, useRef } from 'react'

import styles from './hostlist.module.scss'
import SettingBlock from '../../../SettingBlock/SettingBlock.tsx'
import Button from '../../../../../button/button.tsx'
import ChoicesBase from '../../../../../choicesBase/choicesBase.tsx'
import EnhancedTextArea from '../../../../../EnhancedTextArea/EnhancedTextArea.tsx'
import ManagerVirtList from '../../../../../ManagerVirtList/ManagerVirtList.tsx'

const isURL = (value: string) => /^(?!-)[A-Za-z0-9-]+([\-\.]{1}[a-z0-9]+)*\.[A-Za-z]{2,10}$/.test(value)

export default function Hostlist() {

    return <div className={`${styles.block}`}>
        <ManagerVirtList
            gridArea='a'
            filter={core.FilterManagerRenderer.ListGeneral}
            validator={isURL}
            
            containerLabel='Выбранные домены'
            modalTitle='Добавить домены для фильтрации'
            modalSubheader='Вводите домены, разделяя каждый новой строкой'
            modalPlaceholder={['Пример домена: example.com']}
            />
        <ManagerVirtList
            gridArea='b'
            filter={core.FilterManagerRenderer.ListExclude}
            validator={isURL}
            
            containerLabel='Исключённые домены'
            modalTitle='Исключить домены из фильтрации'
            modalSubheader='Вводите домены, разделяя каждый новой строкой'
            modalPlaceholder={['Пример домена: example.com']}
            />
    </div>
}
