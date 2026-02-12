import { useRef, useState } from 'react'
import { NotifyOptions } from '../../../Contexts/Notify/notify/notify.tsx'
import styles from './notifiesList.module.scss'
export interface NotifyArchivedOptions {
    options: NotifyOptions
}
export default function (props: NotifyArchivedOptions) {
    const { title, description } = props.options
    const [descriptionVisible, setDescriptionVisible] = useState<boolean>(false)
    const visibility_button_img = useRef<HTMLImageElement>(null)

    return <div 
        className={`container ${styles.notify}`}
        onClick={mouseEvent => {
            setDescriptionVisible(!descriptionVisible)
            if (!descriptionVisible) {
                visibility_button_img.current.style.rotate = '180deg'
            } else {
                visibility_button_img.current.style.rotate = '0deg'
            }
        }}
    >
        <div className={styles.notify_title}>{title}</div>
        <div
            className={styles.notify_description}
            hidden={!descriptionVisible}
        >
            {description}
        </div>
        <div className={styles.visibility_button}>
            <img
                ref={visibility_button_img}
                className={styles.visibility_button_img}
                src='./arrow_down.png'
                hidden={!description}
            />
        </div>
    </div>
}