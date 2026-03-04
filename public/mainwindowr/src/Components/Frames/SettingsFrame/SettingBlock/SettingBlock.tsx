import { useEffect, useRef } from 'react'
import styles from './SettingBlock.module.scss'

type SettingBlockProps = {
    children: React.ReactNode
    text: string
}
export default function SettingBlock({ children, text }:SettingBlockProps) {

    return <div className={`container ${styles.setting_block}`}>
        <div className="base_setting_text">{text}</div>
        {children}
    </div>
}
