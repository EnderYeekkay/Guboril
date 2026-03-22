import styles from './Subcontainer.module.scss'
export interface SubcontainerProps {
    children?: React.ReactNode | React.ReactNode []
    addictionClasses?: string[]
}
export default function Subcontainer({ children, addictionClasses }: SubcontainerProps) {
    return <div className={`container ${styles.block} ${addictionClasses?.join(' ')}`}>
		{children}
    </div>
}
