import styles from './general.module.scss'
import SettingBlock from '../../../SettingBlock/SettingBlock.tsx'
import Button from '../../../../../button/button.tsx'
import { useEffect, useRef } from 'react'
import ChoicesBase from '../../../../../choicesBase/choicesBase.tsx'
import EnhancedTextArea from '../../../../../EnhancedTextArea/EnhancedTextArea.tsx'

export default function General() {
    return <div className={`${styles.block}`}>
        <EnhancedTextArea >

        </EnhancedTextArea>
    </div>
}
