import styles from './separator.module.scss'

export interface SeparatorProps {
    addictionClasses?: string[]
}

export default function Separator(props: SeparatorProps) {
    return <div className={`${styles.separator} ${props?.addictionClasses?.join(' ')}`}/>
}
