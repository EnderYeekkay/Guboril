import styles from './modal.module.scss'
import close from './close.png'
import { useRef } from 'react'
import { ModalOptions } from '../ModalProvider.tsx'

export interface ModalProps extends ModalOptions {
    submitButton: React.ReactNode
    cancelButton: React.ReactNode
}
export default function Modal(props: ModalProps) {
    const { title, description, submitButton, actionRow, cancelButton } = props
    const modalRef = useRef<HTMLDivElement>(null)

    return <div className={`container ${styles.block}`} ref={modalRef}>
        <div className={styles.header}>
            <div className={styles.title}>
                {title}
            </div>
                <img
                    src={close}
                    className={styles.close}
                    onClick={() => modalRef.current.remove()}
                />
        </div>
        {description && 
            <div className={styles.description}>
                {description}
            </div>
        }
        <div className={styles.actionRow}>
            {submitButton}
            {actionRow}
            {cancelButton}
        </div>
    </div>
}
