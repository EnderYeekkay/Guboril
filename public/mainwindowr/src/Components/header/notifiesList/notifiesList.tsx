import { RefObject, useContext } from 'react'
import styles from './notifiesList.module.scss'
import Button, { ButtonStyle } from '../../button/button.tsx'
import NotifyContext from '../../../Contexts/Notify/NotifyContext.ts'
import NotifyArchived from './notifyArchived.tsx'

type NotifiesListProps = {
    listRef?: RefObject<HTMLDivElement>
}

export default function NotifiesList({ listRef }: NotifiesListProps) {
    const {setArchivedNotifies, archivedNotifies} = useContext(NotifyContext)

    return <div ref={listRef} className={`container ${styles.box}`}>
        <div className={styles.notify_header}>
            <div className={styles.maintext}>Уведомления</div>
            <Button
                label='Очистить'
                style={ButtonStyle.Danger}
                action={() => setArchivedNotifies([])}
                disabled={archivedNotifies.length === 0}
                addictionClasses={[styles.clear_button]}
            />
        </div>
        <div className={styles.separator}></div>
        {
            archivedNotifies.length > 0
            ? <div className={styles.notifies}> 
                {
                    archivedNotifies
                    .map(notify => <NotifyArchived options={notify}/>)
                    .reverse()
                }
            </div>
            : <div className={styles.no_notifes_text}>Список уведомлений пуст.</div>
        }
    </div>
}
