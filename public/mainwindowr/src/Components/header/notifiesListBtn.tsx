import { useContext } from 'react'
import styles from './header.module.scss'
import NotifyContext from '../../Contexts/Notify/NotifyProvider.tsx'
export default function() {
    const { setVisibilityOfList, visibilityOfList, visibilityOfListBtn } = useContext(NotifyContext)

    return <div
        ref={visibilityOfListBtn}
        className={styles.header_btn}
        id={styles.notifies_list}
        onClick={() => setVisibilityOfList(!visibilityOfList)}
    >
        <img className={styles.header_btn_ico} src="../notifies.png" alt=""/>
    </div>
}