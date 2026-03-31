import { useEffect, useRef } from 'react'
import styles from './SettingBlock.module.scss'

type SettingBlockProps = {
    children: React.ReactNode
    addictionClasses?: string[]
    text: string | React.ReactNode
    description?: string | React.ReactNode
}
export default function SettingBlock({ addictionClasses, children, text, description }:SettingBlockProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        if (!description) containerRef.current.style.rowGap = '0'
    }, [])

    return <div ref={containerRef} className={`container ${styles.setting_block} ${addictionClasses?.join(' ')}`}>
        <div className={styles.base_setting_text}>{text}</div>
        <div/>
        {children}
        {description && 
            <div className={styles.description}>
                {description}
            </div>}
    </div>
}
