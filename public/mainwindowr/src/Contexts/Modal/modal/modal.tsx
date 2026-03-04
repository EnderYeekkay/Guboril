import styles from './modal.module.scss'
import close from './close.png'
import { useEffect, useRef } from 'react'
import { ModalOptions } from '../ModalProvider.tsx'

export interface ModalProps extends ModalOptions {
    submitButton: React.ReactNode
    cancelButton: React.ReactNode
    clearModal: () => void
}
export default function Modal(props: ModalProps) {
    const { title, description, submitButton, actionRow, cancelButton, clearModal} = props
    const modalRef = useRef<HTMLDivElement>(null)
    const descriptionRef = useRef<HTMLDivElement>(null)
    const imgRef = useRef<HTMLImageElement>(null)

    useEffect(() => {
        if (descriptionRef.current?.scrollHeight > 150) {
            descriptionRef.current.style.overflowY='scroll'
        }
    }, [])

    return <div className={`container ${styles.block}`} ref={modalRef}>
        <div className={styles.header}>
            <div className={styles.title}>
                {title}
            </div>
                <img
                    src={close}
                    className={styles.close}
                    ref={imgRef}
                    onClick={clearModal}
                />
        </div>
        {description && 
            <div className={styles.description} ref={descriptionRef}>
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
