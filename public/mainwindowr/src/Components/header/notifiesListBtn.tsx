import styles from './header.module.scss'
export default function() {
    return <div className={styles.header_btn} id={styles.notifies_list} onClick={() => {}}>
        <img className={styles.header_btn_ico} src="../notifies.png" alt=""/>
    </div>
}